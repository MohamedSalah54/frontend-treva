"use client";

import { Box, Typography, Button } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title,
  description,
  icon,
  actionText,
  onAction,
}: EmptyStateProps) {
  return (
    <Box
      textAlign="center"
      py={8}
      px={2}
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
    >
      <Box fontSize={60} color="text.disabled">
        {icon || <InboxIcon fontSize="inherit" />}
      </Box>

      <Typography variant="h6">{title}</Typography>

      {description && (
        <Typography variant="body2" color="text.secondary" maxWidth={400}>
          {description}
        </Typography>
      )}

      {actionText && onAction && (
        <Button variant="contained" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </Box>
  );
}
