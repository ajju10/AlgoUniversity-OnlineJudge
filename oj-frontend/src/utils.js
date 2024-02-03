function getFileType(filename) {
  const ext = filename.split('.');
  let language;
  switch (ext[1]) {
    case 'cpp' || 'c++':
      language = 'C++';
      break;
    case 'java':
      language = 'Java';
      break;
    case 'js':
      language = 'Javascript';
      break;
    case 'py':
      language = 'Python';
      break;
    default:
      language = 'Unknown';
  }

  return language;
}

function getInitialMDText(language) {
  let text;
  switch (language) {
    case 'C++':
      text = 'cpp';
      break;
    case 'Java':
      text = 'java';
      break;
    case 'Javascript':
      text = 'javascript';
      break;
    case 'Python':
      text = 'python';
      break;
    default:
      text = 'Unknown';
  }
  return text;
}

export { getFileType, getInitialMDText };