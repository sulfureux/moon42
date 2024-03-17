import { Button, Checkbox, Input, List, ListItem, ListItemContent, Radio, RadioGroup, Textarea, Typography } from "@mui/joy";
import { LocalizationProvider, MobileDateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useState } from "react";
import { Controller, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { useAppDispatch } from "../../app/hooks";
import { createCampaign } from "../../features/campaigns/reducer";
import { createFilePath, web3StorageClient } from "../../services/web3storage";
import FormError from "../Form/FormError";
import { UploadIcon, VisuallyHiddenInput } from "../Form/Upload";

export type CreateCampaignForm = {
  name: string;
  description: string;

  banner: FileList;
  image: FileList;
  registeredImage: FileList;
  unfinishedImage: FileList;
  finishedImage: FileList;

  registerTime: dayjs.Dayjs;
  startTime: dayjs.Dayjs;
  hasEndTime: boolean;
  endTime: dayjs.Dayjs;

  trackable: string;
  standardCode: string;
  tracks: { track: string; image?: FileList }[];
  stravaData: boolean;
};

const CreateCampaign: React.FC = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isConnected } = useAccount();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<CreateCampaignForm>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: { trackable: "1", tracks: [{ track: "" }], hasEndTime: true, stravaData: false },
  });
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({ control, name: "tracks", rules: { minLength: 1 } });

  const values = watch();

  const onSubmit: SubmitHandler<CreateCampaignForm> = async (values) => {
    setLoading(true);

    const formData = new FormData();

    const imageCid = await web3StorageClient.uploadFile(values.image[0]);
    const bannerCid = await web3StorageClient.uploadFile(values.banner[0]);
    const registeredImageCid = await web3StorageClient.uploadFile(values.registeredImage[0]);
    const unfinishedImageCid = await web3StorageClient.uploadFile(values.unfinishedImage[0]);

    const imageURL = createFilePath(imageCid.toString(), values.image[0].name);
    const bannerURL = createFilePath(bannerCid.toString(), values.banner[0].name);
    const registeredImageURL = createFilePath(registeredImageCid.toString(), values.registeredImage[0].name);
    const unfinishedImageURL = createFilePath(unfinishedImageCid.toString(), values.unfinishedImage[0].name);

    formData.append("name", values.name);
    formData.append("description", values.description);

    // formData.append("image", values.image[0]);
    // formData.append("banner", values.banner[0]);
    // formData.append("registeredImage", values.registeredImage[0]);
    // formData.append("unfinishedImage", values.unfinishedImage[0]);

    formData.append("imageURL", imageURL);
    formData.append("bannerURL", bannerURL);
    formData.append("registeredImageURL", registeredImageURL);
    formData.append("unfinishedImageURL", unfinishedImageURL);

    if (values.trackable !== "1") {
      const finishedImageCid = await web3StorageClient.uploadFile(values.finishedImage[0]);
      const finishedImageURL = createFilePath(finishedImageCid.toString(), values.finishedImage[0].name);

      // formData.append("finishedImage", values.finishedImage[0]);
      formData.append("finishedImageURL", finishedImageURL);
    }

    formData.append("registerTime", values.registerTime.toISOString());
    formData.append("startTime", values.startTime.toISOString());
    formData.append("hasEndTime", values.hasEndTime ? "1" : "0");
    formData.append("endTime", values.endTime.toISOString());

    formData.append("trackable", values.trackable);
    formData.append("standardCode", values.standardCode || "");
    formData.append("stravaData", values.stravaData ? "1" : "0");

    if (values.trackable === "1") {
      await Promise.all(
        values.tracks.map(async (track, index) => {
          const tracksImageCid = await web3StorageClient.uploadFile(track.image![0]);
          const tracksImageURL = createFilePath(tracksImageCid.toString(), track.image![0].name);

          formData.append("tracksValue[]", track.track);
          // formData.append("tracksImage[]", track.image![0]);
          formData.append("tracksImageURL[]", tracksImageURL);
        }),
      );
    }

    dispatch(
      createCampaign({
        campaign: formData,
        callback: (last) => {
          navigate(`/campaign/${last._id}`);
        },
      }),
    );

    setLoading(false);
    reset();
  };

  return (
    <div className="max-w-lg w-full mx-auto">
      <div className="mb-6">
        <Typography level="h1">Create campaign</Typography>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-36">
        <div className="flex gap-4 flex-col">
          <Input {...register("name", { required: "Name is required" })} placeholder="Campaign name" variant="outlined" />
          <FormError label={errors.name} />
          <Textarea {...register("description", { required: "Description is required" })} placeholder="Campaign description" variant="outlined" minRows={4} />
          <FormError label={errors.description} />

          <div className="my-10">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <List sx={{ "--ListItem-paddingX": "0px" }}>
                <ListItem>
                  <ListItemContent>
                    <div>Register Time</div>
                    <Controller
                      name="registerTime"
                      control={control}
                      rules={{ required: true }}
                      defaultValue={dayjs()}
                      render={({ field }) => <MobileDateTimePicker {...field} />}
                    />
                  </ListItemContent>
                </ListItem>

                <ListItem>
                  <ListItemContent>
                    <div>Start Time</div>
                    <Controller name="startTime" control={control} rules={{ required: true }} defaultValue={dayjs()} render={({ field }) => <MobileDateTimePicker {...field} />} />
                  </ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemContent>
                    <div>Has end time?</div>
                    <Checkbox {...register("hasEndTime")} checked={values.hasEndTime} />
                  </ListItemContent>
                </ListItem>

                {values.hasEndTime && (
                  <ListItem>
                    <ListItemContent>
                      <div>End Time</div>
                      <Controller
                        name="endTime"
                        control={control}
                        rules={{ required: true }}
                        defaultValue={dayjs().add(30, "days")}
                        render={({ field }) => <MobileDateTimePicker {...field} />}
                      />
                    </ListItemContent>
                  </ListItem>
                )}
              </List>
            </LocalizationProvider>
          </div>

          {values.banner?.length ? <img width={150} src={URL.createObjectURL(values.banner[0])} /> : null}
          <Button component="label" role={undefined} tabIndex={-1} variant="outlined" color="neutral" startDecorator={<UploadIcon />}>
            Banner
            <VisuallyHiddenInput type="file" {...register("banner", { required: "Banner is required" })} />
          </Button>
          <FormError label={errors.banner} />

          {values.image?.length ? <img width={150} src={URL.createObjectURL(values.image[0])} /> : null}
          <Button component="label" role={undefined} tabIndex={-1} variant="outlined" color="neutral" startDecorator={<UploadIcon />}>
            Thumbnail
            <VisuallyHiddenInput type="file" {...register("image", { required: "Thumbnail is required" })} />
          </Button>
          <FormError label={errors.image} />

          <div className="my-10">
            <RadioGroup defaultValue="1">
              <Radio value="1" {...register("trackable")} label="Trackable campaign" variant="outlined" />
              <Radio value="0" {...register("trackable")} label="Quest campaign" variant="outlined" disabled />
            </RadioGroup>
          </div>

          {values.trackable === "0" && (
            <>
              <Input
                {...register("standardCode", { required: values.trackable === "0" ? "Standard code is required" : false })}
                placeholder="Analytics standard code"
                variant="outlined"
              />
              <FormError label={errors.standardCode} />
            </>
          )}
          <div className="flex items-center gap-2 my-10">
            Strava data <Checkbox {...register("stravaData")} checked={values.stravaData} />
          </div>
          {values.registeredImage?.length ? <img width={150} src={URL.createObjectURL(values.registeredImage[0])} /> : null}
          <Button component="label" role={undefined} tabIndex={-1} variant="outlined" color="neutral" startDecorator={<UploadIcon />}>
            Registered Medal Image
            <VisuallyHiddenInput type="file" {...register("registeredImage", { required: "Registered Medal Image is required" })} />
          </Button>
          <FormError label={errors.registeredImage} />
          {values.unfinishedImage?.length ? <img width={150} src={URL.createObjectURL(values.unfinishedImage[0])} /> : null}
          <Button component="label" role={undefined} tabIndex={-1} variant="outlined" color="neutral" startDecorator={<UploadIcon />}>
            Unfinished Medal Image
            <VisuallyHiddenInput type="file" {...register("unfinishedImage", { required: " Unfinished Medal Image is required" })} />
          </Button>
          <FormError label={errors.unfinishedImage} />
          {values.trackable === "0" && (
            <>
              {values.finishedImage?.length ? <img width={150} src={URL.createObjectURL(values.unfinishedImage[0])} /> : null}
              <Button component="label" role={undefined} tabIndex={-1} variant="outlined" color="neutral" startDecorator={<UploadIcon />}>
                Finished Medal Image
                <VisuallyHiddenInput type="file" {...register("finishedImage", { required: " Finished Medal Image is required" })} />
              </Button>
              <FormError label={errors.finishedImage} />
            </>
          )}
          {values.trackable === "1" && (
            <>
              {fields.map((field, index) => (
                <div key={field.id}>
                  <Input
                    key={field.id}
                    {...register(`tracks.${index}.track`, { required: values.trackable === "1" ? `Track ${index + 1} is required` : false })}
                    placeholder="Track (meters)"
                    variant="outlined"
                    sx={{ "--Input-decoratorChildHeight": "45px" }}
                    endDecorator={
                      <div className="flex items-center gap-3">
                        {values.tracks[index].image?.length ? <img width={40} src={URL.createObjectURL(values.tracks[index].image![0])} /> : null}
                        <Button
                          component="label"
                          role={undefined}
                          tabIndex={-1}
                          variant="outlined"
                          color="neutral"
                          startDecorator={<UploadIcon />}
                          sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                        >
                          Medal Image
                          <VisuallyHiddenInput type="file" {...register(`tracks.${index}.image`, { required: `Track ${index + 1} Medal Image is required` })} />
                        </Button>

                        {index === 0 ? (
                          <Button
                            sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                            onClick={() => {
                              append({ track: "" });
                            }}
                          >
                            +
                          </Button>
                        ) : (
                          <Button
                            sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                            onClick={() => {
                              remove(index);
                            }}
                          >
                            -
                          </Button>
                        )}
                      </div>
                    }
                  />
                  <FormError label={errors.tracks?.[index]?.track} />
                  <FormError label={errors.tracks?.[index]?.image} />
                </div>
              ))}
            </>
          )}
          <Button type="submit" loading={loading} disabled={loading}>
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateCampaign;
