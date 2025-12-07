"use client";

import { type AvatarProps } from "@lobehub/ui";
import { createStyles } from "antd-style";
import { forwardRef } from "react";

import { DEFAULT_USER_AVATAR } from "@/const/meta";
import { useUserStore } from "@/store/user";
import { authSelectors, userProfileSelectors } from "@/store/user/selectors";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const useStyles = createStyles(({ css, token }) => ({
  clickable: css`
    position: relative;
    cursor: pointer;
    transition: all 200ms ease-out 0s;

    &::before {
      content: "";

      position: absolute;
      transform: skewX(-45deg) translateX(-400%);

      overflow: hidden;

      box-sizing: border-box;
      width: 25%;
      height: 100%;

      background: rgba(255, 255, 255, 50%);

      transition: all 200ms ease-out 0s;
    }

    &:hover {
      box-shadow: 0 0 0 2px ${token.colorPrimary};

      &::before {
        transform: skewX(-45deg) translateX(400%);
      }
    }
  `,
}));

export interface UserAvatarProps extends AvatarProps {
  clickable?: boolean;
}

const UserAvatar = forwardRef<HTMLDivElement, UserAvatarProps>(
  ({ clickable, className, style, ...rest }, ref) => {
    const { styles, cx } = useStyles();
    const [avatar, username] = useUserStore((s) => [
      userProfileSelectors.userAvatar(s),
      userProfileSelectors.username(s),
    ]);

    const isSignedIn = useUserStore(authSelectors.isLogin);

    return (
      <Avatar
        alt={isSignedIn ? (username as string) : "NuGet Next"}
        avatar={isSignedIn ? avatar || "" : DEFAULT_USER_AVATAR}
        className={cx(clickable && styles.clickable, className)}
        ref={ref}
        style={{ flex: "none", ...style }}
        unoptimized
        {...rest}
      >
        <AvatarImage src={avatar} alt={username} />
        <AvatarFallback>{DEFAULT_USER_AVATAR}</AvatarFallback>
      </Avatar>
    );
  },
);

UserAvatar.displayName = "UserAvatar";

export default UserAvatar;
