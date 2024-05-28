import PropTypes from 'prop-types';
//
import SettingsDrawer from './drawer';
//
import ThemeColorPresets from './ThemeColorPresets';

// ----------------------------------------------------------------------

ThemeSettings.propTypes = {
  children: PropTypes.node.isRequired,
};

export default function ThemeSettings({ children }) {
  return (
    <ThemeColorPresets>
        {children}
        <SettingsDrawer />
    </ThemeColorPresets>
  );
}
