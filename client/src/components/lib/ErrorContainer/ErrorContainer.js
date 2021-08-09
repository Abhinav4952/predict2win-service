import { Box, Typography } from '@material-ui/core';

export default function ErrorContainer({ text }) {
  return (
    <div className="d-flex justify-content-center align-items-center align-content-center" style={{ height: '330px' }}>
      <Box>
        <Typography variant="body1" gutterBottom style={{ whiteSpace: 'pre-line' }}>
          {text}
        </Typography>
      </Box>
    </div>
  );
}
