import React from 'react'
import avatarStyle from '../../styles/Chat.module.css'
import { AvatarProps } from '../../utils/interfaces'

export default function Avatar({ image }: AvatarProps) {
  return <img src={image} alt={`image ${image}`} className={avatarStyle.avatar} />
}