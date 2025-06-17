import React from 'react';
import {
  linkListContainerStyle,
  linkListHeaderStyle,
  linkListRowStyle,
  linkListCellCentered,
  linkListCell,
} from '../../styles';
import Button, { btnClicked } from '../../button';

export interface LinkItem {
  id: number;
  link: string;
  subscribed: boolean;
  liked: boolean;
  commented: boolean;
}

interface LinkListProps {
  links: LinkItem[];
  onRemove: (id: number) => void;
}

const LinkList: React.FC<LinkListProps> = ({ links, onRemove }) => {
  const handleDelete = (id: number) => {
    btnClicked('Delete');
    onRemove(id);
  };

  return (
    <ul style={linkListContainerStyle}>
      <li key="header" style={linkListHeaderStyle}>
        <div style={linkListCellCentered}>Sr No.</div>
        <div style={linkListCell}>Links</div>
        <div style={linkListCellCentered}>Subscribed</div>
        <div style={linkListCellCentered}>Liked</div>
        <div style={linkListCellCentered}>Commented</div>
        <div style={linkListCellCentered}>Remove</div>
      </li>
      {links.map((item, index) => (
        <li key={item.id} style={linkListRowStyle}>
          <div style={linkListCellCentered}>{index + 1}</div>
          <div style={linkListCell}>{item.link}</div>
          <div style={linkListCellCentered}>
            {item.subscribed ? '✔️' : '❌'}
          </div>
          <div style={linkListCellCentered}>{item.liked ? '✔️' : '❌'}</div>
          <div style={linkListCellCentered}>{item.commented ? '✔️' : '❌'}</div>
          <div style={linkListCellCentered}>
            <Button
              btnId={`delete-${item.id}`}
              onClick={() => handleDelete(item.id)}
              customStyle={{
                cursor: 'pointer',
                padding: '2px 8px',
                fontSize: '13px',
                height: '25px',
              }}
            >
              Delete
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default LinkList;
