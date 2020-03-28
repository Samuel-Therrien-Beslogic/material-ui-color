/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-props-no-spreading */
/**
 * Copyright (c) Mik BRY
 * mik@mikbry.com
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Popover from '@material-ui/core/Popover';
import ColorButton from './ColorButton';
import ColorBox from './ColorBox';
import * as ColorTool from '../helpers/colorTool';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    width: 'max-content',
  },
  button: {
    margin: '6px',
  },
}));

const ColorPicker = ({ value, disableTextfield, deferred, palette, inputFormats, onChange }) => {
  const refPicker = React.useRef();
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const color = ColorTool.parse(value);

  const handleClick = () => {
    setOpen(Boolean(refPicker.current));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleColorChange = newColor => {
    let newValue = newColor.name;
    if (newValue.startsWith('color-')) {
      newValue = ColorTool.getCssColor(newColor, 'hex');
    }
    onChange(newValue);
    if (deferred) {
      setOpen(false);
    }
  };

  const handleChange = event => {
    onChange(event.target.value);
  };

  const id = open ? 'color-popover' : undefined;

  return (
    <div className={classes.root} ref={refPicker}>
      <ColorButton className={classes.button} color={color} aria-describedby={id} onClick={handleClick} />
      {disableTextfield ? (
        <div role="button" onClick={handleClick}>
          {color.raw}
        </div>
      ) : (
        <TextField color="primary" value={color.raw} onChange={handleChange} />
      )}
      <Popover
        id={id}
        open={open}
        anchorEl={refPicker.current}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <ColorBox
          value={color}
          deferred={deferred}
          palette={palette}
          inputFormats={inputFormats}
          onChange={handleColorChange}
        />
      </Popover>
    </div>
  );
};

const Uncontrolled = ({ defaultValue, ...props }) => {
  const [value, onChange] = React.useState(defaultValue);
  return <ColorPicker value={value} onChange={onChange} {...props} />;
};

export default ({ defaultValue, value, onChange, ...props }) =>
  defaultValue ? (
    <Uncontrolled defaultValue={defaultValue} {...props} />
  ) : (
    <ColorPicker value={value} onChange={onChange} {...props} />
  );