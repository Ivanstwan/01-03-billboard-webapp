import React from 'react';
import DiffViewer from 'react-diff-viewer-continued';

const newStyles = {
  variables: {
    dark: {
      addedBackground: '#f1f5f9',
      addedColor: 'black',
      removedBackground: '#f1f5f9',
      removedColor: 'black',
      wordAddedBackground: '#86d194',
      wordRemovedBackground: '#c77d85',
      emptyLineBackground: '#f1f5f9',
    },
  },
};

const StringDiffViewer = ({ oldString, newString }) => {
  return (
    <DiffViewer
      oldValue={oldString}
      newValue={newString}
      splitView={true}
      hideLineNumbers={true}
      useDarkTheme={true}
      styles={newStyles}
    />
  );
};

export default StringDiffViewer;
