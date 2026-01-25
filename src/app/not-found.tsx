"use client";

import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      px={2}
    >
      <Box>
        <SentimentDissatisfiedIcon
          sx={{ fontSize: 80, color: "text.disabled" }}
        />

        <Typography variant="h4" mt={2}>
          404 - Page Not Found
        </Typography>

        <Typography color="text.secondary" mt={1} mb={3}>
          The page you are looking for doesn’t exist.
        </Typography>

        <Button variant="contained" onClick={() => router.push("/")}>
          Go Home
        </Button>
      </Box>
    </Box>
  );
}
