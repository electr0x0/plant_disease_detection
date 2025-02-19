// Third-party Imports
import styled from '@emotion/styled'

// Util Imports
import { menuButtonStyles } from '../../components/vertical-menu/MenuButton'
import { menuClasses } from '../../utils/menuClasses'

// Style Imports

const StyledVerticalMenuItem = styled.li`
  position: relative;
  margin-block-start: 4px;
  ${({ menuItemStyles }) => menuItemStyles};
  ${({ rootStyles }) => rootStyles};

  > .${menuClasses.button} {
    ${({ level, disabled, isCollapsed, isPopoutWhenCollapsed }) =>
      menuButtonStyles({
        level,
        disabled,
        isCollapsed,
        isPopoutWhenCollapsed
      })};
    ${({ buttonStyles }) => buttonStyles};
  }
`

export default StyledVerticalMenuItem
