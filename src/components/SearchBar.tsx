import { useEffect, useState } from 'react';
import type { FocusEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { Search } from 'lucide-react';
import { fetchTags } from '../lib/api';
import { FASHION_CATEGORIES } from '../lib/catalog';
import './SearchBar.css';

const MAX_TAGS = 12;

export function SearchBar({ initialQuery = '' }: { initialQuery?: string }) {
  const navigate = useNavigate();
  const [value, setValue] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (open && tags.length === 0) fetchTags(FASHION_CATEGORIES).then(setTags);
  }, [open, tags.length]);

  const needle = value.trim().toLowerCase();
  const suggestions = tags.filter((tag) => tag.includes(needle)).slice(0, MAX_TAGS);

  const close = () => {
    setOpen(false);
    (document.activeElement as HTMLElement | null)?.blur();
  };

  const search = (query: string) => {
    const q = query.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    close();
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    search(value);
  };

  const onBlur = (e: FocusEvent<HTMLFormElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
  };

  return (
    <>
      {open && <div className="search-backdrop" onClick={close} aria-hidden="true" />}
      <form
        className="search-bar"
        role="search"
        onSubmit={onSubmit}
        onFocus={() => setOpen(true)}
        onBlur={onBlur}
        onKeyDown={(e) => e.key === 'Escape' && close()}
      >
        <input
          type="search"
          name="q"
          placeholder="Search..."
          className="input"
          aria-label="Search products"
          autoComplete="off"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button className="submit" type="submit" aria-label="Search">
          <Search />
        </button>
        {open && suggestions.length > 0 && (
          <div className="search-suggestions">
            <p className="search-suggestions-title">{needle ? 'Matching tags' : 'Popular tags'}</p>
            <ul className="search-tags">
              {suggestions.map((tag) => (
                <li key={tag}>
                  <button type="button" className="search-tag" onClick={() => search(tag)}>
                    {tag}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </>
  );
}
