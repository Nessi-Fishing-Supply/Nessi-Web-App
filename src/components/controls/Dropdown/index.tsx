import React, { useState } from 'react';
import styles from './dropdown.module.scss';
import Button from '../Button';

interface DropdownProps {
  children: React.ReactNode;
  label: string;
}

const Dropdown: React.FC<DropdownProps> = ({ children, label }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.dropdown}>
      <Button onClick={toggleDropdown} style="primary">
        {label}
      </Button>
      {isOpen && (
        <div className={styles.dropdownMenu}>
          {React.Children.map(children, (child) => (
            <div className={styles.dropdownItem}>
              {child}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;