const newLineText = (val) => {
    return val.toString().split(/\\n|\/\/n|\/n|\n/).map((str, i) => (<span key={i}><span>{str}</span><br /></span>));
}

export default newLineText;
