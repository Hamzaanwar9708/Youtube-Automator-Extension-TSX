import { CSSProperties } from 'react';

export const baseStyle = (
  btnName: string,
  isHovered: string | null
): CSSProperties => ({
  backgroundColor: isHovered === btnName ? '#357ABD' : '#4A90E2',
  border: 'none',
  color: '#fff',
  padding: '12px 24px',
  fontSize: '1.5rem',
  borderRadius: '8px',
  cursor: 'pointer',
  transition:
    'transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease',
  transform: isHovered === btnName ? 'scale(1.05)' : 'scale(1)',
  boxShadow: isHovered === btnName ? '0 4px 8px rgba(0, 0, 0, 0.2)' : 'none',
});

export const initialStyle = (): CSSProperties => ({
  width: '750px',
  height: '30px',
  padding: '16px',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '40px',
});

export const popupContainerStyle: CSSProperties = {
  width: '750px',
  height: '400px',
  background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
  borderRadius: '12px',
  boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
  overflow: 'hidden',
  fontFamily: 'Helvetica, Arial, sans-serif, sans-serif',
  display: 'flex',
  flexDirection: 'column',
};

export const popupHeaderStyle: CSSProperties = {
  width: '750px',
  height: '30px',
  backgroundColor: '#4A90E2',
  padding: '16px',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const popupTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: '2.5rem',
};

export const popupButtonStyle = (isHovered: string | null): CSSProperties => ({
  width: '38px',
  height: '38px',
  right: '20px',
  position: 'absolute',
  borderRadius: '14px',
  border: 'none',
  backgroundColor: '#82B4EE',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const closeButtonStyle: CSSProperties = {
  position: 'absolute',
  top: '10px',
  left: '10px',
  background: 'transparent',
  border: 'none',
  fontSize: '24px',
  fontWeight: 'bold',
  cursor: 'pointer',
  lineHeight: 1,
};

export const popupMainContainerStyle: CSSProperties = {
  position: 'fixed',
};

export const popupInjectContainerStyle = (
  top: number,
  left: number
): CSSProperties => ({
  position: 'fixed',
  top: top,
  left: left,
  zIndex: 9999,
  transition: 'top 0.3s ease, left 0.3s ease',
});

export const popupImgStyle: CSSProperties = {
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const linkListContainerStyle: CSSProperties = {
  backgroundColor: '#e0f7fa',
  width: '750px',
  height: '200px',
  overflowY: 'auto',
  scrollbarWidth: 'none',
  listStyle: 'none',
  padding: '0',
  margin: '0',
  border: '1px solid #ccc',
  borderBottomLeftRadius: '20px',
  borderBottomRightRadius: '20px',
};

export const linkListHeaderStyle: CSSProperties = {
  display: 'flex',
  fontWeight: 'bold',
  fontSize: '15px',
  borderBottom: '1px solid #ccc',
  padding: '8px 0',
};

export const linkListRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  fontSize: '12.5px',
  borderBottom: '1px solid #eee',
  padding: '4px 0',
};

export const linkListCellCentered: CSSProperties = {
  flex: '1',
  textAlign: 'center',
};

export const linkListCell: CSSProperties = {
  flex: '3',
  textAlign: 'center',
};

export const multipleSectionInputWrapperStyle: CSSProperties = {
  width: '420px',
};

export const multipleSectionInputStyle: CSSProperties = {
  width: '380px',
  height: '25px',
};

export const multipleSectionAddButtonWrapperStyle: CSSProperties = {
  width: '120px',
};

export const multipleSectionAddButtonStyle: CSSProperties = {
  width: '80px',
  height: '30px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const multipleSectionButtonRowStyle: CSSProperties = {
  maxWidth: '95%',
  marginTop: '2.5px',
  justifyContent: 'space-evenly',
};

export const multipleSectionActionButtonStyle: CSSProperties = {
  width: '125px',
  height: '30px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const filterSectionStyle: CSSProperties = {
  padding: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: '8px',
  fontSize: '2rem',
  color: '#222',
};

export const filterGroupStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  backgroundColor: '#f0f4fa',
  padding: '8px 12px',
  borderRadius: '8px',
  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
};

export const filterLabelStyle: CSSProperties = {
  width: '100px',
  fontWeight: 600,
  fontSize: '1.5rem',
};

export const filterInputStyle: CSSProperties = {
  width: '90px',
  height: '24px',
  padding: '4px 8px',
  fontSize: '1.5rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
  outline: 'none',
};

export const filterButtonContainerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '12px',
  gap: '12px',
};

export const modalOverlayStyle: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 10000,
};

export const modalContainerStyle: CSSProperties = {
  backgroundColor: '#fff',
  borderRadius: '10px',
  padding: '24px 32px',
  maxWidth: '400px',
  width: '90%',
  boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
  textAlign: 'center',
};

export const modalTitleStyle: CSSProperties = {
  color: '#d32f2f',
  marginBottom: '16px',
};

export const modalMessageStyle: CSSProperties = {
  color: '#333',
};

export const modalButtonStyle: CSSProperties = {
  marginTop: '20px',
  padding: '8px 16px',
  backgroundColor: '#d32f2f',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};
