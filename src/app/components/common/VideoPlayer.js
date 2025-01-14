const VideoPlayer = ({src}) => {
    return (
      <div style={{
        padding: '20px',
        border: '3px solid #2c3e50',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)',
        backgroundColor: '#f8f9fa',
        maxWidth: '800px',
        margin: '20px auto'
      }}>
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '8px'
        }}>
          <video
            width="100%"
            height="auto"
            controls
            autoPlay
            muted
            type="video/mp4"
            src={src}
            style={{
              display: 'block',
              borderRadius: '4px'
            }}
          >
          </video>
        </div>
      </div>
    );
  };

  export default VideoPlayer;