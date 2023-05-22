import React from 'react'

import PropTypes from 'prop-types'

const AppComponent = (props:any) => {
  return (
    <>
      <div style={{
  flex: '0 0 auto',
  width: '32%',
  height: 'auto',
  display: 'flex',
  position: 'relative',
  alignItems: 'flex-start',
  borderColor: '#fbfbfb',
  borderWidth: '1px',
  borderRadius: 'var(--dl-radius-radius-radius8)',
  justifyContent: 'center',
  backgroundColor: 'rgba(110, 175, 217, 0.1)'
}} className={`component-container ${props.rootClassName} `}>
        <span className="component-text">{props.text}</span>
      </div>
      <style jsx>
        {`
          .component-container {
            flex: 0 0 auto;
            width: 32%;
            height: auto;
            display: flex;
            position: relative;
            align-items: flex-start;
            border-color: #fbfbfb !important;
            border-width: 1px !important;
            border-radius: var(--dl-radius-radius-radius8);
            justify-content: center;
            background-color: rgba(110, 175, 217, 0.1) !important;
            
          }
          .component-text {
            color: #ffffff;
            align-self: center;
            text-align: center;
            padding-top: var(--dl-space-space-oneandhalfunits);
            padding-left: var(--dl-space-space-unit);
            padding-right: var(--dl-space-space-unit);
            padding-bottom: var(--dl-space-space-oneandhalfunits);
          }
          .component-root-class-name {
            width: 32%;
          }
          .component-root-class-name1 {
            width: 32%;
          }
          .component-root-class-name2 {
            width: 32%;
          }

          @media (max-width: 479px) {
            .component-container {
              width: 80%;
            }
            .component-root-class-name {
              margin-bottom: var(--dl-space-space-unit);
            }
            .component-root-class-name1 {
              margin-bottom: var(--dl-space-space-unit);
            }
            .component-root-class-name2 {
              margin-bottom: var(--dl-space-space-unit);
            }
            .component-root-class-name3 {
              margin-bottom: var(--dl-space-space-unit);
            }
            .component-root-class-name4 {
              margin-bottom: var(--dl-space-space-unit);
            }
            .component-root-class-name5 {
              margin-bottom: var(--dl-space-space-unit);
            }
            .component-root-class-name6 {
              margin-bottom: var(--dl-space-space-unit);
            }
          }
        `}
      </style>
    </>
  )
}

AppComponent.defaultProps = {
  rootClassName: '',
  text: '“can you tell me about your design services?” →',
}

AppComponent.propTypes = {
  rootClassName: PropTypes.string,
  text: PropTypes.string,
}

export default AppComponent
