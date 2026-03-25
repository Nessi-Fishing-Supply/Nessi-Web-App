'use client';

import { useState, useRef, useEffect } from 'react';
import { HiDotsVertical, HiSwitchHorizontal, HiUserRemove } from 'react-icons/hi';
import Image from 'next/image';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/context';
import {
  useShopMembers,
  useRemoveShopMember,
  useUpdateMemberRole,
} from '@/features/shops/hooks/use-shops';
import { useShopRoles } from '@/features/shops/hooks/use-shop-roles';
import { useToast } from '@/components/indicators/toast/context';
import Modal from '@/components/layout/modal';
import Button from '@/components/controls/button';
import RoleSelect from '@/features/shops/components/role-select';
import type { Shop, ShopMember } from '@/features/shops/types/shop';
import type { ShopRole } from '@/features/shops/types/permissions';
import { SYSTEM_ROLE_IDS } from '@/features/shops/constants/roles';
import styles from './shop-members-section.module.scss';

interface ShopMembersSectionProps {
  shop: Shop;
}

function getRoleLabel(roleId: string, roles: ShopRole[]): string {
  const role = roles.find((r) => r.id === roleId);
  return role?.name ?? 'Contributor';
}

function getMemberDisplayName(member: ShopMember): string {
  if (member.members) {
    const name = `${member.members.first_name ?? ''} ${member.members.last_name ?? ''}`.trim();
    if (name) return name;
  }
  return 'Unknown Member';
}

function getMemberHandle(member: ShopMember): string | null {
  return member.members?.slug ?? null;
}

function getMemberInitials(member: ShopMember): string {
  if (member.members) {
    const first = member.members.first_name?.[0] ?? '';
    const last = member.members.last_name?.[0] ?? '';
    if (first || last) return `${first}${last}`.toUpperCase();
  }
  return '?';
}

type ModalAction =
  | { type: 'changeRole'; member: ShopMember; roleId: string }
  | { type: 'remove'; member: ShopMember };

interface MemberRowProps {
  member: ShopMember;
  isOwner: boolean;
  isCurrentUser: boolean;
  roles: ShopRole[];
  onAction: (action: ModalAction) => void;
  isPending: boolean;
}

function MemberRow({ member, isOwner, isCurrentUser, roles, onAction, isPending }: MemberRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isOwnerRole = member.role_id === SYSTEM_ROLE_IDS.OWNER;
  const displayName = getMemberDisplayName(member);
  const handle = getMemberHandle(member);
  const roleLabel = getRoleLabel(member.role_id, roles);
  const initials = getMemberInitials(member);
  const avatarUrl = member.members?.avatar_url;

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  // Close menu on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  const showMenu = isOwner && !isOwnerRole && !isCurrentUser;

  return (
    <li className={styles.memberRow}>
      <div className={styles.memberInfo}>
        <div className={styles.avatar}>
          {avatarUrl ? (
            <Image src={avatarUrl} alt="" width={40} height={40} className={styles.avatarImage} />
          ) : (
            <span className={styles.avatarInitials} aria-hidden="true">
              {initials}
            </span>
          )}
        </div>
        <div className={styles.memberDetails}>
          <span className={styles.memberName}>
            {displayName}
            {isCurrentUser && (
              <span className={styles.youBadge} aria-label="(you)">
                {' '}
                (you)
              </span>
            )}
          </span>
          {handle && <span className={styles.memberHandle}>@{handle}</span>}
        </div>
        <span
          className={`${styles.memberRole} ${styles[`role-${roleLabel.toLowerCase()}`] ?? ''}`}
          aria-label={`Role: ${roleLabel}`}
        >
          {roleLabel}
        </span>
      </div>

      {showMenu && (
        <div className={styles.menuWrapper} ref={menuRef}>
          <button
            ref={buttonRef}
            className={styles.menuButton}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={`Actions for ${displayName}`}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            disabled={isPending}
          >
            <HiDotsVertical aria-hidden="true" />
          </button>

          {menuOpen && (
            <div className={styles.menu} role="menu" aria-label="Member actions">
              <button
                className={styles.menuItem}
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  onAction({ type: 'changeRole', member, roleId: member.role_id });
                }}
              >
                <HiSwitchHorizontal aria-hidden="true" />
                Change Role
              </button>
              <button
                className={`${styles.menuItem} ${styles.menuItemDanger}`}
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  onAction({ type: 'remove', member });
                }}
              >
                <HiUserRemove aria-hidden="true" />
                Remove from Shop
              </button>
            </div>
          )}
        </div>
      )}
    </li>
  );
}

export default function ShopMembersSection({ shop }: ShopMembersSectionProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { data: members, isLoading, isError } = useShopMembers(shop.id);
  const { data: roles = [] } = useShopRoles(shop.id);
  const removeShopMember = useRemoveShopMember();
  const updateMemberRole = useUpdateMemberRole();

  const [modalAction, setModalAction] = useState<ModalAction | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

  const isOwner = !!user && shop.owner_id === user.id;
  const isPending = removeShopMember.isPending || updateMemberRole.isPending;

  const handleAction = (action: ModalAction) => {
    setModalAction(action);
    if (action.type === 'changeRole') {
      setSelectedRoleId(action.member.role_id);
    }
  };

  const handleConfirmRemove = () => {
    if (modalAction?.type !== 'remove') return;
    const { member } = modalAction;
    setModalAction(null);

    removeShopMember.mutate(
      { shopId: shop.id, memberId: member.member_id },
      {
        onSuccess: () => {
          showToast({
            type: 'success',
            message: 'Member removed',
            description: `${getMemberDisplayName(member)} has been removed from this shop.`,
          });
        },
        onError: () => {
          showToast({
            type: 'error',
            message: 'Failed to remove member',
            description: 'Something went wrong. Please try again.',
          });
        },
      },
    );
  };

  const handleConfirmRoleChange = () => {
    if (modalAction?.type !== 'changeRole' || !selectedRoleId) return;
    const { member } = modalAction;
    if (selectedRoleId === member.role_id) {
      setModalAction(null);
      return;
    }

    setModalAction(null);

    const previousMembers = queryClient.getQueryData<ShopMember[]>(['shops', shop.id, 'members']);

    // Optimistic update
    queryClient.setQueryData<ShopMember[]>(['shops', shop.id, 'members'], (old) =>
      old?.map((m) => (m.member_id === member.member_id ? { ...m, role_id: selectedRoleId } : m)),
    );

    updateMemberRole.mutate(
      { shopId: shop.id, memberId: member.member_id, roleId: selectedRoleId },
      {
        onSuccess: (data) => {
          showToast({
            type: 'success',
            message: `Role updated to ${data.roleName}`,
            description: `${getMemberDisplayName(member)}'s role has been updated.`,
          });
        },
        onError: () => {
          queryClient.setQueryData(['shops', shop.id, 'members'], previousMembers);
          showToast({
            type: 'error',
            message: 'Failed to update role',
            description: 'Something went wrong. Please try again.',
          });
        },
      },
    );
  };

  return (
    <section className={styles.card} aria-labelledby="shop-members-heading">
      <h2 id="shop-members-heading" className={styles.heading}>
        Members
      </h2>
      <p className={styles.description}>
        People who have access to this shop. Only the owner can manage roles and remove members.
      </p>

      {isLoading && (
        <p className={styles.stateMessage} role="status" aria-live="polite">
          Loading members…
        </p>
      )}

      {isError && (
        <p className={styles.stateMessage} role="alert" aria-live="assertive">
          Failed to load members. Please refresh and try again.
        </p>
      )}

      {!isLoading && !isError && members && members.length === 0 && (
        <p className={styles.stateMessage}>No members found for this shop.</p>
      )}

      {!isLoading && !isError && members && members.length > 0 && (
        <ul className={styles.memberList} aria-label="Shop members">
          {members.map((member) => (
            <MemberRow
              key={member.id}
              member={member}
              isOwner={isOwner}
              isCurrentUser={user?.id === member.member_id}
              roles={roles}
              onAction={handleAction}
              isPending={isPending}
            />
          ))}
        </ul>
      )}

      {/* Change Role Modal */}
      <Modal
        isOpen={modalAction?.type === 'changeRole'}
        onClose={() => setModalAction(null)}
        ariaLabel="Change member role"
      >
        {modalAction?.type === 'changeRole' && (
          <div className={styles.confirmModal}>
            <h3 className={styles.confirmTitle}>Change role</h3>
            <p className={styles.confirmMessage}>
              Select a new role for <strong>{getMemberDisplayName(modalAction.member)}</strong>.
            </p>
            <div className={styles.roleSelectWrapper}>
              <RoleSelect
                roles={roles}
                currentRoleId={selectedRoleId ?? modalAction.member.role_id}
                onChange={(roleId) => setSelectedRoleId(roleId)}
                ariaLabel={`New role for ${getMemberDisplayName(modalAction.member)}`}
              />
            </div>
            {selectedRoleId && selectedRoleId !== modalAction.member.role_id && (
              <p className={styles.confirmHint}>
                This will change their role from{' '}
                <strong>{getRoleLabel(modalAction.member.role_id, roles)}</strong> to{' '}
                <strong>{getRoleLabel(selectedRoleId, roles)}</strong> and immediately update their
                permissions.
              </p>
            )}
            <div className={styles.confirmActions}>
              <Button style="secondary" onClick={() => setModalAction(null)}>
                Cancel
              </Button>
              <Button
                style="primary"
                onClick={handleConfirmRoleChange}
                disabled={!selectedRoleId || selectedRoleId === modalAction.member.role_id}
              >
                Change Role
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Remove Member Modal */}
      <Modal
        isOpen={modalAction?.type === 'remove'}
        onClose={() => setModalAction(null)}
        ariaLabel="Remove member from shop"
      >
        {modalAction?.type === 'remove' && (
          <div className={styles.confirmModal}>
            <h3 className={styles.confirmTitle}>Remove member?</h3>
            <p className={styles.confirmMessage}>
              Remove <strong>{getMemberDisplayName(modalAction.member)}</strong> from this shop?
              They will lose all access immediately. This action cannot be undone.
            </p>
            <div className={styles.confirmActions}>
              <Button style="secondary" onClick={() => setModalAction(null)}>
                Cancel
              </Button>
              <Button style="danger" onClick={handleConfirmRemove}>
                Remove Member
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
