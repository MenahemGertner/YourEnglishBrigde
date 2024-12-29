const ConditionalRender = ({ data, children }) => {
    if (!data || (Array.isArray(data) && data.length === 0)) return null;
    return children;
  };

export default ConditionalRender;