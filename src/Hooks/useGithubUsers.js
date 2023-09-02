import { useState, useEffect } from 'react';
import axios from 'axios';

const useGithubUsers = (query) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = process.env.GIT_AUTH_TOKEN;

    const fetchGithubUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `https://api.github.com/search/users?q=${query}&sort=followers&order=desc`,
          {
            headers: {
              Authorization: `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`,
            },
          }
        );

        if (response.status === 200) {
          setUsers(response.data.items);
        } else {
          setError(`Error: ${response.status}`);
        }
      } catch (error) {
        setError(`An error occurred: ${error.message}`);
      }

      setLoading(false);
    };

    if (query) {
      fetchGithubUsers();
    } else {
      setUsers([]);
      setLoading(false);
    }
  }, [query]);

  return { loading, error, users };
};

export default useGithubUsers;
