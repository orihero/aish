import React from 'react';
import styled from 'styled-components';

interface FlagProps {
  countryCode: string;
  size?: number;
  className?: string;
}

const FlagContainer = styled.div<{ size: number }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.size}px;
  height: ${props => props.size * 0.75}px;
  
  svg {
    width: 100%;
    height: 100%;
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
`;

const Flag: React.FC<FlagProps> = ({ countryCode, size = 24, className }) => {
  const getFlagSvg = (code: string) => {
    switch (code) {
      case 'en':
        return (
          <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" className="iconify iconify--twemoji" preserveAspectRatio="xMidYMid meet" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#00247D" d="M0 9.059V13h5.628zM4.664 31H13v-5.837zM23 25.164V31h8.335zM0 23v3.941L5.63 23zM31.337 5H23v5.837zM36 26.942V23h-5.631zM36 13V9.059L30.371 13zM13 5H4.664L13 10.837z"></path><path fill="#CF1B2B" d="M25.14 23l9.712 6.801a3.977 3.977 0 0 0 .99-1.749L28.627 23H25.14zM13 23h-2.141l-9.711 6.8c.521.53 1.189.909 1.938 1.085L13 23.943V23zm10-10h2.141l9.711-6.8a3.988 3.988 0 0 0-1.937-1.085L23 12.057V13zm-12.141 0L1.148 6.2a3.994 3.994 0 0 0-.991 1.749L7.372 13h3.487z"></path><path fill="#EEE" d="M36 21H21v10h2v-5.836L31.335 31H32a3.99 3.99 0 0 0 2.852-1.199L25.14 23h3.487l7.215 5.052c.093-.337.158-.686.158-1.052v-.058L30.369 23H36v-2zM0 21v2h5.63L0 26.941V27c0 1.091.439 2.078 1.148 2.8l9.711-6.8H13v.943l-9.914 6.941c.294.07.598.116.914.116h.664L13 25.163V31h2V21H0zM36 9a3.983 3.983 0 0 0-1.148-2.8L25.141 13H23v-.943l9.915-6.942A4.001 4.001 0 0 0 32 5h-.663L23 10.837V5h-2v10h15v-2h-5.629L36 9.059V9zM13 5v5.837L4.664 5H4a3.985 3.985 0 0 0-2.852 1.2l9.711 6.8H7.372L.157 7.949A3.968 3.968 0 0 0 0 9v.059L5.628 13H0v2h15V5h-2z"></path><path fill="#CF1B2B" d="M21 15V5h-6v10H0v6h15v10h6V21h15v-6z"></path></g></svg>
        );
      case 'ru':
        return (
          <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" className="iconify iconify--twemoji" preserveAspectRatio="xMidYMid meet" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#CE2028" d="M36 27a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4v-4h36v4z"></path><path fill="#22408C" d="M0 13h36v10H0z"></path><path fill="#EEE" d="M32 5H4a4 4 0 0 0-4 4v4h36V9a4 4 0 0 0-4-4z"></path></g></svg>
        );
      case 'uz':
        return (
          <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" className="iconify iconify--twemoji" preserveAspectRatio="xMidYMid meet" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#0099B5" d="M0 9v4h36V9a4 4 0 0 0-4-4H4a4 4 0 0 0-4 4z"></path><path fill="#1EB53A" d="M36 27v-4H0v4a4 4 0 0 0 4 4h28a4 4 0 0 0 4-4z"></path><path fill="#CE1126" d="M0 13h36v1.5H0zm0 8.5h36V23H0z"></path><path fill="#EEE" d="M0 18v3.5h36v-7H0z"></path><path fill="#FFF" d="M4.2 9.16a3.12 3.12 0 0 1 2.6-3.076a3.12 3.12 0 1 0 0 6.152A3.12 3.12 0 0 1 4.2 9.16zm4.683 2.303l-.14-.431l-.14.431h-.454l.367.267l-.14.431l.367-.267l.366.267l-.14-.431l.367-.267zm2.702 0l-.14-.431l-.14.431h-.453l.367.267l-.14.431l.366-.267l.367.267l-.14-.431l.367-.267zm-.14-2.927l-.14.431h-.453l.367.267l-.14.431l.366-.267l.367.267l-.14-.431l.367-.267h-.454zm2.843 2.927l-.14-.431l-.14.431h-.453l.366.267l-.14.431l.367-.267l.367.267l-.14-.431l.366-.267zm-.14-2.927l-.14.431h-.453l.366.267l-.14.431l.367-.267l.367.267l-.14-.431l.366-.267h-.453zm0-2.496l-.14.431h-.453l.366.267l-.14.431l.367-.267l.367.267l-.14-.431l.366-.267h-.453zm2.843 5.423l-.14-.431l-.14.431h-.454l.367.267l-.14.431l.367-.267l.366.267l-.14-.431l.367-.267zm-.14-2.927l-.14.431h-.454l.367.267l-.14.431l.367-.267l.366.267l-.14-.431l.367-.267h-.453zm0-2.496l-.14.431h-.454l.367.267l-.14.431l.367-.267l.366.267l-.14-.431l.367-.267h-.453zm2.842 5.423l-.14-.431l-.14.431h-.453l.367.267l-.14.431l.366-.267l.367.267l-.14-.431l.367-.267zm-.14-2.927l-.14.431h-.453l.367.267l-.14.431l.366-.267l.367.267l-.14-.431l.367-.267h-.454zm0-2.496l-.14.431h-.453l.367.267l-.14.431l.366-.267l.367.267l-.14-.431l.367-.267h-.454z"></path></g></svg>
        );
      default:
        return null;
    }
  };

  const flagSvg = getFlagSvg(countryCode);

  if (!flagSvg) {
    // Fallback to a simple colored rectangle if SVG is not found
    return (
      <FlagContainer size={size} className={className}>
        <div style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#ccc',
          borderRadius: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10px',
          color: '#666'
        }}>
          {countryCode.toUpperCase()}
        </div>
      </FlagContainer>
    );
  }

  return (
    <FlagContainer size={size} className={className}>
      {flagSvg}
    </FlagContainer>
  );
};

export default Flag;
