import {
  useContext,
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  AuthContext,
} from "../context/AuthContext";

import {
  getProfile,
  updateProfile,
  changePassword,
} from "../services/profileService";

import Spinner from "../components/Spinner";

function ProfilePage() {
    const { user } =
        useContext(AuthContext);

    const [loading, setLoading] =
        useState(true);

    const [name, setName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [
        currentPassword,
        setCurrentPassword,
        ] = useState("");

const [
    newPassword,
    setNewPassword,
    ] = useState("");

  useEffect(() => {
    const fetchProfile =
      async () => {
        try {
          const data =
            await getProfile(
              user.token
            );

          setName(data.name);
          setEmail(data.email);
        } catch (error) {
          toast.error(
            "Failed to load profile"
          );
        } finally {
          setLoading(false);
        }
      };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        await updateProfile(
          {
            name,
            email,
          },
          user.token
        );

        toast.success(
          "Profile Updated"
        );
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Update failed"
        );
      }
    };

    const handlePasswordChange =
        async (e) => {
            e.preventDefault();

            try {
            await changePassword(
                {
                currentPassword,
                newPassword,
                },
                user.token
            );

            toast.success(
                "Password Updated"
            );

            setCurrentPassword("");
            setNewPassword("");
            } catch (error) {
            toast.error(
                error.response?.data
                ?.message ||
                "Failed"
            );
            }
        };

    if (loading) {
        return <Spinner />;
    }

    return (
        <div
        className="
            max-w-3xl
            mx-auto
            px-8
            py-12
        "
        >
        <div
            className="
            bg-slate-900
            border
            border-slate-800
            rounded-2xl
            p-8
            "
        >
            <h1
            className="
                text-4xl
                font-bold
                mb-8
            "
            >
            My Profile
            </h1>

            <form
            onSubmit={handleSubmit}
            className="space-y-6"
            >
            <div>
                <label
                className="
                    block
                    mb-2
                "
                >
                Name
                </label>

                <input
                type="text"
                value={name}
                onChange={(e) =>
                    setName(
                    e.target.value
                    )
                }
                className="
                    w-full
                    p-3
                    rounded-lg
                    bg-slate-800
                "
                />
            </div>

            <div>
                <label
                className="
                    block
                    mb-2
                "
                >
                Email
                </label>

                <input
                type="email"
                value={email}
                onChange={(e) =>
                    setEmail(
                    e.target.value
                    )
                }
                className="
                    w-full
                    p-3
                    rounded-lg
                    bg-slate-800
                "
                />
            </div>

            <button
                type="submit"
                className="
                bg-amber-500
                hover:bg-amber-400
                text-black
                px-6
                py-3
                rounded-lg
                font-semibold
                "
            >
                Save Changes
            </button>
            </form>

            <div
                className="
                    mt-10
                    border-t
                    border-slate-700
                    pt-8
                "
                >
                <h2
                    className="
                    text-2xl
                    font-bold
                    mb-6
                    "
                >
                    Change Password
                </h2>

                <form
                    onSubmit={
                    handlePasswordChange
                    }
                    className="space-y-4"
                >
                    <input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) =>
                        setCurrentPassword(
                        e.target.value
                        )
                    }
                    className="
                        w-full
                        p-3
                        rounded-lg
                        bg-slate-800
                    "
                    />

                    <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) =>
                        setNewPassword(
                        e.target.value
                        )
                    }
                    className="
                        w-full
                        p-3
                        rounded-lg
                        bg-slate-800
                    "
                    />

                    <button
                    type="submit"
                    className="
                        bg-green-600
                        hover:bg-green-500
                        px-6
                        py-3
                        rounded-lg
                    "
                    >
                    Update Password
                    </button>
                </form>
                </div>
        </div>
        </div>
    );
}

export default ProfilePage;