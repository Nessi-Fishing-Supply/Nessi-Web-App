import React, { useState, useRef, useEffect } from 'react';
import styles from './dropdown.module.scss';

interface DropdownProps {
  children: React.ReactNode;
  label?: string;
  icon?: React.ReactNode;
}

interface DropdownItemProps {
  children: React.ReactNode;
  isClickable?: boolean;
}

interface DropdownTitleProps {
  children: React.ReactNode;
}

const DropdownContext = React.createContext({ closeDropdown: () => {} });

// DropdownItem component
const DropdownItem: React.FC<DropdownItemProps> = ({ children, isClickable = true }) => {
  const { closeDropdown } = React.useContext(DropdownContext);

  const handleClick = () => {
    if (isClickable) {
      closeDropdown();
    }
  };

  return (
    <div onClick={handleClick} className={isClickable ? styles.dropdownItem : styles.dropdownItemNoClick}>
      {children}
    </div>
  );
};

// DropdownTitle component
const DropdownTitle: React.FC<DropdownTitleProps> = ({ children }) => {
  return (
    <div className={styles.dropdownTitle}>
      {children}
    </div>
  );
};

// Dropdown component
const Dropdown: React.FC<DropdownProps> = ({ children, label, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const margin = 24;

      if (dropdownRect.right > window.innerWidth - margin) {
        dropdownRef.current.style.left = `${window.innerWidth - dropdownRect.right - margin}px`;
      }
      if (dropdownRect.left < margin) {
        dropdownRef.current.style.left = `${margin - dropdownRect.left}px`;
      }
    }
  }, [isOpen]);

  return (
    <DropdownContext.Provider value={{ closeDropdown }}>
      <div className={styles.dropdown}>
        <button onClick={toggleDropdown} className={styles.trigger}>
          {icon ? icon : label}
        </button>
        {isOpen && (
          <div ref={dropdownRef} className={styles.menu}>
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child) && (child.type === DropdownItem || child.type === DropdownTitle)) {
                return React.cloneElement(child);
              }
              return <DropdownItem>{child}</DropdownItem>;
            })}
          </div>
        )}
      </div>
    </DropdownContext.Provider>
  );
};

export { Dropdown, DropdownItem, DropdownTitle };