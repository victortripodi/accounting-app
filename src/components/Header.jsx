import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SignOutIcon from '@atlaskit/icon/glyph/sign-out';
import QuestionIcon from '@atlaskit/icon/glyph/question';
import { IconButton } from '@atlaskit/button/new';
import { AtlassianNavigation, PrimaryButton, Settings, Help } from '@atlaskit/atlassian-navigation';
import { useAuth } from '../provider/authProvider';
import { useMediaQuery } from 'react-responsive';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import '../styles/SignUp.css';

const DefaultSettings = () => <Settings tooltip="Product settings" />;

const Header = ({ companyName }) => {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const onLogout = useCallback(() => {
    setToken(null);
    navigate('/login');
  }, [setToken, navigate]);

  const renderDropdownMenu = () => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      marginLeft: '10px'
    }}>
      <DropdownMenu trigger="Menu" shouldRenderToParent>
        <DropdownItemGroup>
          <DropdownItem onClick={() => navigate('/dashboard')}>Dashboard</DropdownItem>
          <DropdownItem onClick={() => navigate('/sales/list')}>Sales</DropdownItem>
          <DropdownItem onClick={() => navigate('/purchases/list')}>Purchases</DropdownItem>
          <DropdownItem onClick={() => navigate('/journal/list')}>Accounting</DropdownItem>
        </DropdownItemGroup>
      </DropdownMenu>
    </div>
  );

  return (
    <AtlassianNavigation
      label="site"
      renderSettings={() => <IconButton icon={SignOutIcon} onClick={onLogout} />}
      renderHelp={() => <IconButton icon={QuestionIcon} onClick={() => navigate('/help')} />}
      primaryItems={
        isMobile
          ? renderDropdownMenu()
          : [
            <PrimaryButton onClick={() => navigate('/dashboard')}>Dashboard</PrimaryButton>,
            <PrimaryButton onClick={() => navigate('/sales/list')}>Sales</PrimaryButton>,
            <PrimaryButton onClick={() => navigate('/purchases/list')}>Purchases</PrimaryButton>,
            <PrimaryButton onClick={() => navigate('/journal/list')}>Accounting</PrimaryButton>,
          ]
      }
      renderProductHome={() => <p style={{marginRight:'10px'}}>VT</p>}
    />
  );
};

export default Header;
