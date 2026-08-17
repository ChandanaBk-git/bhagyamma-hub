import { useState } from "react";

import {
  Card,
  CardContent,
  Typography,
  Stack,
  Switch,
  Divider,
  Grid,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";

const ThemeSettings = ({ value = {}, onChange }) => {

  const [darkMode, setDarkMode] = useState(value.darkMode || false);
  const [language, setLanguage] = useState(value.language || "English");
  const [themeColor, setThemeColor] = useState(value.themeColor || "Green");

  const syncValue = (nextDarkMode, nextLanguage, nextThemeColor) => {
    const nextValue = {
      darkMode: nextDarkMode,
      language: nextLanguage,
      themeColor: nextThemeColor,
    };
    onChange?.(nextValue);
  };

  return (

    <Card
      elevation={2}
      sx={{
        borderRadius:4,
        mb:3,
      }}
    >

      <CardContent>

        <Typography
          variant="h6"
          fontWeight="bold"
          mb={3}
        >
          Appearance Settings
        </Typography>

        <Stack spacing={3}>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >

            <Stack>

              <Typography fontWeight="bold">
                Dark Mode
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Enable dark theme for the application.
              </Typography>

            </Stack>

            <Switch
              checked={darkMode}
              color="success"
              onChange={() => {
                const nextValue = !darkMode;
                setDarkMode(nextValue);
                syncValue(nextValue, language, themeColor);
              }}
            />

          </Stack>

          <Divider />

          <Grid
            container
            spacing={3}
          >

            <Grid item xs={12} md={6}>

              <TextField
                select
                fullWidth
                label="Theme Color"
                value={themeColor}
                onChange={(e) => {
                  const nextValue = e.target.value;
                  setThemeColor(nextValue);
                  syncValue(darkMode, language, nextValue);
                }}
              >

                <MenuItem value="Green">
                  Green
                </MenuItem>

                <MenuItem value="Blue">
                  Blue
                </MenuItem>

                <MenuItem value="Purple">
                  Purple
                </MenuItem>

                <MenuItem value="Orange">
                  Orange
                </MenuItem>

              </TextField>

            </Grid>

            <Grid item xs={12} md={6}>

              <TextField
                select
                fullWidth
                label="Language"
                value={language}
                onChange={(e) => {
                  const nextValue = e.target.value;
                  setLanguage(nextValue);
                  syncValue(darkMode, nextValue, themeColor);
                }}
              >

                <MenuItem value="English">
                  English
                </MenuItem>

                <MenuItem value="Kannada">
                  Kannada
                </MenuItem>

                <MenuItem value="Hindi">
                  Hindi
                </MenuItem>

              </TextField>

            </Grid>

          </Grid>

        </Stack>

        <Button
          variant="contained"
          color="success"
          sx={{
            mt:4,
          }}
          onClick={() => syncValue(darkMode, language, themeColor)}
        >
          Save Appearance
        </Button>

      </CardContent>

    </Card>

  );

};

export default ThemeSettings;