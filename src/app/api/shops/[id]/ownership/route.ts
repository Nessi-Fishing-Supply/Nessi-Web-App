import { createAdminClient } from '@/libs/supabase/admin';
import { AUTH_CACHE_HEADERS } from '@/libs/api-headers';
import { SYSTEM_ROLE_IDS } from '@/features/shops/constants/roles';
import { NextResponse } from 'next/server';
import { requireShopPermission } from '@/libs/shop-permissions';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: shopId } = await params;

  const result = await requireShopPermission(request, 'members', 'full', {
    expectedShopId: shopId,
  });
  if (result instanceof NextResponse) return result;

  let newOwnerId: string;
  try {
    const body = await request.json();
    newOwnerId = body.newOwnerId;
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400, headers: AUTH_CACHE_HEADERS },
    );
  }

  if (!newOwnerId) {
    return NextResponse.json(
      { error: 'newOwnerId is required' },
      { status: 400, headers: AUTH_CACHE_HEADERS },
    );
  }

  const admin = createAdminClient();

  // Verify newOwnerId is already a shop member
  const { data: newOwnerMember } = await admin
    .from('shop_members')
    .select('member_id')
    .eq('shop_id', shopId)
    .eq('member_id', newOwnerId)
    .single();

  if (!newOwnerMember) {
    return NextResponse.json(
      { error: 'New owner must already be a member of the shop' },
      { status: 400, headers: AUTH_CACHE_HEADERS },
    );
  }

  // Atomically update ownership: shops.owner_id, new owner role_id → Owner, current owner role_id → Manager
  const [shopUpdate, newOwnerRoleUpdate, currentOwnerRoleUpdate] = await Promise.all([
    admin.from('shops').update({ owner_id: newOwnerId }).eq('id', shopId),
    admin
      .from('shop_members')
      .update({ role_id: SYSTEM_ROLE_IDS.OWNER })
      .eq('shop_id', shopId)
      .eq('member_id', newOwnerId),
    admin
      .from('shop_members')
      .update({ role_id: SYSTEM_ROLE_IDS.MANAGER })
      .eq('shop_id', shopId)
      .eq('member_id', result.user.id),
  ]);

  if (shopUpdate.error) {
    return NextResponse.json(
      { error: `Failed to transfer shop ownership: ${shopUpdate.error.message}` },
      { status: 500, headers: AUTH_CACHE_HEADERS },
    );
  }

  if (newOwnerRoleUpdate.error) {
    return NextResponse.json(
      { error: `Failed to update new owner role: ${newOwnerRoleUpdate.error.message}` },
      { status: 500, headers: AUTH_CACHE_HEADERS },
    );
  }

  if (currentOwnerRoleUpdate.error) {
    return NextResponse.json(
      { error: `Failed to update previous owner role: ${currentOwnerRoleUpdate.error.message}` },
      { status: 500, headers: AUTH_CACHE_HEADERS },
    );
  }

  return NextResponse.json({ success: true }, { headers: AUTH_CACHE_HEADERS });
}
