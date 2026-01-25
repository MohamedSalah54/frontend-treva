"use client";

import { Box, CircularProgress, Typography } from "@mui/material";

interface AppLoaderProps {
  text?: string;
  fullScreen?: boolean;
}

export default function AppLoader({
  text = "Loading...",
  fullScreen = true,
}: AppLoaderProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight={fullScreen ? "80vh" : "100%"}
      gap={2}
    >
      <CircularProgress />
      <Typography variant="body2" color="text.secondary">
        {text}
      </Typography>
    </Box>
  );
}
