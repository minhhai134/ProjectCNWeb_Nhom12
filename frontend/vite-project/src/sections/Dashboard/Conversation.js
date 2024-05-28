import React from "react";
import {
  Stack,
  Box,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Divider,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { DotsThreeVertical, DownloadSimple, Image } from "phosphor-react";
import { Message_options } from "../../data";
import truncateString from "../../utils/truncate";
import { LinkPreview } from "@dhaiwat10/react-link-preview";
import ReactPlayer from 'react-player';
import Embed from 'react-embed';

const MessageOption = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <DotsThreeVertical
        size={20}
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Stack spacing={1} px={1}>
          {Message_options.map((el) => (
            <MenuItem key={el.title} onClick={handleClose}>{el.title}</MenuItem>
          ))}
        </Stack>
      </Menu>
    </>
  );
};

const TextMsg = ({ content, sentTime, incoming, menu }) => {
  const theme = useTheme();
  return (
    <Stack direction='column'>
    <Stack direction="row" justifyContent={incoming ? "start" : "end"}>
      <Box
        px={1.5}
        py={1.5}
        sx={{
          backgroundColor: incoming
            ? alpha(theme.palette.background.default, 1)
            : theme.palette.primary.main,
          borderRadius: 1.5,
          width: "max-content",
        }}
      >
        <Typography
          variant="body2"
          color={incoming ? theme.palette.text : "#fff"}
        >
          {content}
        </Typography>
      </Box>
      {menu && <MessageOption />}
    </Stack>
    <Box
        px={10}
        py={0.5}
        sx={{
          width:'100%',
        }}
      >
        <Typography
          variant="caption"
          sx={{ color:  theme.palette.text, display: 'block', textAlign: incoming?'left':'right'  }}
        >
          {sentTime}
        </Typography>
      </Box>
    </Stack>
  );
};


export { TextMsg };
