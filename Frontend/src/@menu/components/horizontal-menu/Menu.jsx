'use client'

// React Imports
import { createContext, forwardRef, useMemo } from 'react'

// Third-party Imports
import { FloatingTree } from '@floating-ui/react'
import classnames from 'classnames'

// Util Imports
import { horizontalSubMenuToggleDuration } from '../../defaultConfigs'
import styles from '../../styles/horizontal/horizontalUl.module.css'
import StyledHorizontalMenu from '../../styles/horizontal/StyledHorizontalMenu'
import { menuClasses } from '../../utils/menuClasses'

// Styled Component Imports

// Style Imports

// Default Config Imports

export const HorizontalMenuContext = createContext({})

const Menu = (props, ref) => {
  // Props
  const {
    children,
    className,
    rootStyles,
    menuItemStyles,
    triggerPopout = 'hover',
    browserScroll = false,
    transitionDuration = horizontalSubMenuToggleDuration,
    renderExpandIcon,
    renderExpandedMenuItemIcon,
    popoutMenuOffset = { mainAxis: 0 },
    textTruncate = true,
    verticalMenuProps,
    ...rest
  } = props

  const providerValue = useMemo(
    () => ({
      triggerPopout,
      browserScroll,
      menuItemStyles,
      renderExpandIcon,
      renderExpandedMenuItemIcon,
      transitionDuration,
      popoutMenuOffset,
      textTruncate,
      verticalMenuProps
    }),
    [
      triggerPopout,
      browserScroll,
      menuItemStyles,
      renderExpandIcon,
      renderExpandedMenuItemIcon,
      transitionDuration,
      popoutMenuOffset,
      textTruncate,
      verticalMenuProps
    ]
  )

  return (
    <HorizontalMenuContext.Provider value={providerValue}>
      <FloatingTree>
        <StyledHorizontalMenu
          ref={ref}
          className={classnames(menuClasses.root, className)}
          rootStyles={rootStyles}
          {...rest}
        >
          <ul className={styles.root}>{children}</ul>
        </StyledHorizontalMenu>
      </FloatingTree>
    </HorizontalMenuContext.Provider>
  )
}

export default forwardRef(Menu)
