import React, { useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormProvider from "../../../components/hook-form/FormProvider";
import { RHFTextField } from "../../../components/hook-form";
import { Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../../utils/axios";
import { UpdateDisplayName } from "../../../redux/slices/auth";

const ProfileForm = () => {
  const dispatch = useDispatch();
  const { user_id,displayName  } = useSelector((state) => state.auth);

  const ProfileSchema = Yup.object().shape({
    displayName: Yup.string().required("Name is required"),
  });

  const defaultValues = {
    displayName: displayName || "",
  };

  const methods = useForm({
    resolver: yupResolver(ProfileSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      console.log(user_id)
      const params = new URLSearchParams();
      params.append('id', user_id);
      params.append('displayName', data.displayName);

      const response = await axios.put("/updateUser", params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (response.data.status === "success") {
        console.log("Profile updated successfully");
        dispatch(UpdateDisplayName(data.displayName))
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <RHFTextField
          helperText={"This name is required"}
          name="displayName"
          label="Display Name"
        />

        <Stack direction={"row"} justifyContent="end">
          <LoadingButton
            color="primary"
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Save
          </LoadingButton>
        </Stack>
      </Stack>
    </FormProvider>
  );
};

export default ProfileForm;
