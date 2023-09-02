"use client";

import { TUser } from "@/lib/types";
import { Avatar, Button } from "@nextui-org/react";
import React from "react";
import Icon from "../Icon";

import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { formatDate } from "@/lib/utils";
import { setMoreInfo } from "@/redux/userSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const ProfileDetails = ({ user }: { user: TUser }) => {
  const dispatch = useAppDispatch();

  const router = useRouter();

  const currentUser = useAppSelector((state) => state.auth);
  const { moreInfo } = useAppSelector((state) => state.user);

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async (userData: { userId: string }) => {
      try {
        const { data } = await axios.post("/api/users/follow", {
          userId: userData.userId,
        });
        console.log(data);
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(["me"]);
    },
  });

  const handleFollow = () => {
    if (currentUser.authStatus) {
      mutate({ userId: user.id });
    } else {
      router.push("/signin");
    }
  };

  return (
    <section className="md:w-[80%] m-auto md:pt-16 pt-12">
      <div className="bg-white p-4  md:rounded-md">
        <div className="flex items-center justify-between md:pl-4">
          <Avatar
            src={user.avatar}
            className="lg:h-28 lg:w-28 md:h-24 md:w-24 outline-[5px] outline-neutral-100 outline-offset-0 h-20 w-20 relative -mt-16"
            name={user.name}
          />
          <div className="flex flex-col justify-end gap-4">
            {currentUser.user?.id === user.id ? (
              <Button color="primary" radius="sm">
                Edit Profile
              </Button>
            ) : (
              <div className="flex items-center gap-4">
                <Button color="primary" radius="sm" onClick={handleFollow}>
                  {currentUser.user?.followingIDs.includes(user.id)
                    ? "unFollow"
                    : "Follow"}
                </Button>
                <Button isIconOnly variant="light">
                  <Icon name="more-horizontal" />
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="pt-4">
          <h1 className="lg:text-2xl md:text-xl text-lg md:font-bold font-medium">
            {user.name}
          </h1>
          <p>@{user.username}</p>
          <p className="text-lg py-2">
            {user.bio
              ? user.bio
              : "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Unde, a. Tenetur, odit atque?"}
          </p>
          <div className="flex gap-4 py-2">
            <div className="flex gap-1">
              <p className="font-semibold text-default-500 text-small">
                {user.followingIDs.length}
              </p>
              <p className=" text-default-500 text-small">Following</p>
            </div>
            <div className="flex gap-1">
              <p className="font-semibold text-default-500 text-small">
                {user.followerIDs.length}
              </p>
              <p className="text-default-500 text-small">Followers</p>
            </div>
          </div>
          <div className="text-small text-default-500 py-2 flex gap-3 items-center">
            <Icon name="cake" />
            <span>joined on {formatDate(user.createdAt)}</span>
          </div>
        </div>
        {moreInfo ? null : (
          <Button
            variant="bordered"
            fullWidth
            radius="sm"
            size="lg"
            className="font-semibold mt-4 md:hidden text-neutral-600"
            onClick={() => dispatch(setMoreInfo(true))}
          >
            More info about @{user.username}
          </Button>
        )}
      </div>
    </section>
  );
};

export default ProfileDetails;