import { Box, CircularProgress } from '@material-ui/core';

export default function ProgressContainer() {
  return (
    <div className="d-flex justify-content-center align-items-center align-content-center" style={{ height: '330px' }}>
      <Box>
        <CircularProgress />
      </Box>
    </div>
  );
}
