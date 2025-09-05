import FollowButton from "@/components/FollowButton";
import ProfileArticles from "@/components/ProfileArticles";
import fetchServer from "@/lib/req/fetchServer";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getProfile(username: string) {
  const response = await fetchServer(`/profiles/${username}`);
  const deserialized = await response.json();
  if (!deserialized.profile) {
    notFound();
  }
  return deserialized.profile as User;
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getProfile(id);
  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <Image
                src={profile.image}
                className="user-img"
                alt="profile picture"
                width={100}
                height={100}
              />
              <h4>{profile.username}</h4>
              <p>{profile.bio}</p>
            </div>
          </div>
          <Controls user={profile} />
        </div>
      </div>
      <ProfileArticles author={profile.username} />
    </div>
  );
}

function Controls({ user }: { user: User }) {
  return (
    <>
      <FollowButton user={user} />
      <button className="btn btn-sm btn-outline-secondary action-btn">
        <i className="ion-gear-a"></i>
        &nbsp; <Link href="/settings">Edit profile settings</Link>
      </button>
    </>
  );
}
