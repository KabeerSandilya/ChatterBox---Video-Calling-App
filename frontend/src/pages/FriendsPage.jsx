import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { useMemo, useState } from "react";
import { getUserFriends } from "../lib/api";
import FriendCard from "../components/FriendCard";
import PageLoader from "../components/PageLoader";

const FriendsPage = () => {
  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query) return friends;
    const lower = query.toLowerCase();
    return friends.filter((f) => f.fullName.toLowerCase().includes(lower));
  }, [friends, query]);

  if (isLoading) return <PageLoader />;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold">Your Friends</h2>
          <div className="flex items-center gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search friends by name..."
              className="input input-bordered input-sm"
            />
            <Link to="/notifications" className="btn btn-outline btn-sm">
              View Requests
            </Link>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="card bg-base-200 p-6 text-center">
            <h3 className="font-semibold text-lg mb-2">No friends found</h3>
            <p className="opacity-70">Try a different name or check your requests.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((f) => (
              <FriendCard key={f._id} friend={f} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;
