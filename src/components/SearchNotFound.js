import PropTypes from "prop-types";
import { Paper, Typography, Skeleton } from "@mui/material";

// ----------------------------------------------------------------------

SearchNotFound.propTypes = {
  searchQuery: PropTypes.string,
  loading: PropTypes.bool
};

export default function SearchNotFound({ searchQuery = "", loading, ...other }) {
  if (loading) {
    return (
      <Skeleton variant="rectangular" height={150} {...other} />
    );
  }
  return (
    <Paper sx={{ p: 3, textAlign: "center" }}>
      <Typography gutterBottom variant="subtitle1">Not found</Typography>
      {searchQuery && (
        <Typography variant="body2">
          No results found for <strong>&quot;{searchQuery}&quot;</strong>.
          Try checking for typos or using complete words.
        </Typography>
      )}
    </Paper>
  );
}
