/* eslint-disable import/no-unresolved */
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useContext, useState, useCallback } from "react";
import { mainContext } from "src/contexts/MainContext";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { Box, Grid, Card, Stack, Typography, Button, InputAdornment, IconButton } from "@mui/material";
import Modal from "@mui/material/Modal";
import { LoadingButton } from "@mui/lab";
// components
import Iconify from "../../../../components/Iconify";
// hooks
import useAuth from "../../../../hooks/useAuth";
// components
import { FormProvider, RHFTextField, RHFUploadAvatar } from "../../../../components/hook-form";

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordNew, setShowPasswordNew] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuth();
  const ctx = useContext(mainContext);

  const UpdateUserSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    fullname: Yup.string().required("Full Name is required"),
    description: Yup.string(),
    image: Yup.string(),
  });

  const UpdatePasswordSchema = Yup.object().shape({
    oldPassword: Yup.string().required("Old Password is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("New Password is required"),
    confirmNewPassword: Yup.string().oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  const defaultValues = {
    username: user?.username || "",
    fullname: user?.fullname || "",
    description: user?.description || "",
    image: user?.image || "",
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const updatePasswordMethods = useForm({
    resolver: yupResolver(UpdatePasswordSchema),
    defaultValues: {
      oldPassword: "",
      password: "",
      confirmNewPassword: "",
    },
  });

  const {
    handleSubmit: handleSubmitPassword,
    formState: { isSubmitting: isSubmittingPassword },
    reset: resetPassword,
    setError,
  } = updatePasswordMethods;

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          "image",
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  const onSubmit = async () => {
    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("fullname", values.fullname);
    formData.append("description", values.description);
    formData.append("image", values.image);

    try {
      await ctx.updatePersonalInformation(formData, user._id);
      enqueueSnackbar("Update success!");
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  const onSubmitPass = async (data) => {
    const { oldPassword, password } = data;
    const obj = { oldPassword, password };
    try {
      const res = await ctx.updatePassword(obj, user._id);
      if (res.response?.data?.message === "Old password incorrect") {
        setError("oldPassword", {
          message: "Wrong old password!",
        });
      } else {
        enqueueSnackbar("Update success!");
        setChangePassword(false);
        resetPassword();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box>
      <FormProvider key={1} methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ py: 10, px: 3, textAlign: "center" }}>
              <RHFUploadAvatar
                name="image"
                accept="image/*"
                maxSize={900000}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: "auto",
                      display: "block",
                      textAlign: "center",
                      color: "text.secondary",
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png
                    <br /> max size of 900KB
                  </Typography>
                }
              />
              {/* <Button sx={{ marginTop: 2 }} onClick={() => setChangePassword(true)}>
                Change Password
              </Button> */}
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h4" sx={{ paddingBottom: "1rem" }}>
                Personal Informations
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  rowGap: 3,
                  columnGap: 2,
                  gridTemplateColumns: { xs: "repeat(1, 1fr)", sm: "repeat(2, 1fr)" },
                }}
              >
                <Box sx={{ display: "grid", rowGap: 3, columnGap: 2 }}>
                  <RHFTextField name="username" label="Username" />
                  <RHFTextField name="fullname" label="Full Name" />
                </Box>
                <Box sx={{ display: "grid", rowGap: 3, columnGap: 2 }}>
                  <RHFTextField name="description" label="Description" multiline rows={5} />
                </Box>

              </Box>
              <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  Save Changes
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>

      <Modal open={changePassword} onClose={() => setChangePassword(false)}>
        <Box
          sx={{ height: "100vh" }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
        >
          <Card sx={{ p: 3, width: "40%" }}>
            <FormProvider key={2} methods={updatePasswordMethods} onSubmit={handleSubmitPassword(onSubmitPass)}>
              <Stack spacing={3} alignItems="flex-end">
                <RHFTextField
                  name="oldPassword"
                  type={showPassword ? "text" : "password"}
                  label="Old Password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          <Iconify icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <RHFTextField
                  name="password"
                  type={showPasswordNew ? "text" : "password"}
                  label="New Password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPasswordNew(!showPasswordNew)} edge="end">
                          <Iconify icon={showPasswordNew ? "eva:eye-fill" : "eva:eye-off-fill"} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <RHFTextField
                  name="confirmNewPassword"
                  type={showPasswordNew ? "text" : "password"}
                  label="Confirm New Password"
                />

                <Box>
                  <Button onClick={() => setChangePassword(false)} sx={{ marginRight: 3 }}>
                    Cancel
                  </Button>
                  <LoadingButton type="submit" variant="contained" loading={isSubmittingPassword}>
                    Save Changes
                  </LoadingButton>
                </Box>
              </Stack>
            </FormProvider>
          </Card>
        </Box>
      </Modal>
    </Box>
  );
}
