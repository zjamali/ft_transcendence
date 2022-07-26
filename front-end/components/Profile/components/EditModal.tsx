

import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import {useState} from "react";
import Button from '@mui/material/Button';
import Image from "next/image"
import TextField from '@mui/material/TextField';
import intra from "../public/42.jpg"
import { styled } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import Switch, { SwitchProps } from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { OutlinedInputProps } from '@mui/material/OutlinedInput';
import { withThemeCreator } from '@material-ui/styles';
// import "./../styles/Profile.css"

type EditModalProps = {
	closeModal: (t:boolean) => void;
}

// const styles = theme => ({
// 	testColor: {
// 		color: "white"
// 	}
// })
const CssTextField = styled(TextField)({
	'& label.Mui-focused': {
	  color: '#ff3030',
	},
	'& .MuiInputLabel-root': {
		color: 'white',
	},
	'&  .MuiInputBase-root' : {
		color: '#919eab',

	},

	'&  .MuiInputBase-root: hover' : {
		color: 'white',
	},
	'& .MuiInput-underline:after': {
	  borderBottomColor: 'white',
	},
	'& .MuiOutlinedInput-root': {
	  '& fieldset': {
		borderColor: '#919eab',
	  },
	  '&:hover fieldset': {
		borderColor: 'white',
	  },
	  '&.Mui-focused fieldset': {
		borderColor: '#ff3030',
		color: 'white'
	  },
	},
  });

const Android12Switch = styled(Switch)(({ theme }) => ({
	padding: 8,
	'& .MuiSwitch-track': {
	  borderRadius: 22 / 2,
	  '&:before, &:after': {
		content: '""',
		position: 'absolute',
		top: '50%',
		transform: 'translateY(-50%)',
		width: 16,
		height: 16,
	  },
	  '&:before': {
		backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
		  theme.palette.getContrastText(theme.palette.primary.main),
		)}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
		left: 12,
	  },
	  '&:after': {
		backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
		  theme.palette.getContrastText(theme.palette.primary.main),
		)}" d="M19,13H5V11H19V13Z" /></svg>')`,
		right: 12,
	  },
	},
	'& .MuiSwitch-thumb': {
	  boxShadow: 'none',
	  width: 16,
	  height: 16,
	  margin: 2,
	},
  }));

const EditModal:React.FC<EditModalProps> = ({closeModal}) => {
	const test: string = "abdait-m"
	const primary = red[500]
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
	  setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
	  setAnchorEl(null);
	};
	return (
		<>
			<div className="overlay-modal" onClick={() => closeModal(false)} />
			<div className="edit-modal">
				<div className="modal-picture">
					<div className="modal-picture-container">
						<Image src={intra} alt="avatar" layout="fill" />
					</div>
					<div className="modal-picture-upload">
						<Button variant="contained" size="small" component="label" style={{color:"white", backgroundColor: "#919eab"}}>
        					Upload photo
        					<input hidden accept="image/*" type="file" />
      					</Button>
					</div>
				</div>
				<div className="modal-data">
					{/* <div className="user-name"> username </div> */}
					<div className="modal-data-input">
						<CssTextField
							// id="outlined-required"
							// id="custom-css-outlined-input"
							label="Username"
							defaultValue={test}
							// InputProps={{
							// 	classes: {
							// 		input: classes.testColor
							// 	}
							// }}
							size="small"
						/>
					</div>
					<div className="modal-two-factor">
						<FormControlLabel
							label="TWO-FACTOR AUTH"
							labelPlacement='start'
							control={<Android12Switch />}
						/>
					</div>
				</div>
				<div className="modal-buttons">
					{/* <div className='modal-cancel'>
						<Button variant="contained" size="small" color="secondary">Cancel</Button>
					</div> */}
					<div className='modal-submit'>
						<Button variant='contained' size="small" color='success'>Confirm</Button>
					</div>
					{/* <button onClick={() => closeModal(false)}>Cancel</button> */}
				</div>
			</div>
		</>
	)
}

export default EditModal