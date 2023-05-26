import React from "react";

type ComponentProps = {
  rootClassName?: string;
  text?: string;
  onTextClick?: (query: string) => void;
};

const Component: React.FC<ComponentProps> = ({
  rootClassName = "",
  text = "“can you tell me about your design services?” →",
  onTextClick,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onTextClick?.(text);
  };
  return (
    <>
      <div className={`component-container ${rootClassName} bordercard`}>
        <span className="component-text" onClick={handleClick}>
          {text}
        </span>
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
            // border-color: var(--dl-color-gray-white);
            // border-width: 1px;
            border-radius: var(--dl-radius-radius-radius8);
            justify-content: center;

            background-color: #17262b;
            border: 1px solid rgba(251, 251, 251, 0.3);
          }
          // .bordercard {
          //   border-color: #fbfbfb !important ;
          //   border-width: 2px !important;
          //   border-radius: var(--dl-radius-radius-radius8) !important;
          // }
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
              width: 32%;
            }
            .component-text {
              width: 100%;
              font-size: 14px;
              max-width: 100%;
              padding-top: var(--dl-space-space-halfunit);
              padding-left: var(--dl-space-space-halfunit);
              padding-right: var(--dl-space-space-halfunit);
              padding-bottom: var(--dl-space-space-halfunit);
            }
            .component-root-class-name {
              max-width: 32%;
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
  );
};

export default Component;
