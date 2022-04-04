--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2 (Ubuntu 14.2-1.pgdg20.04+1)
-- Dumped by pg_dump version 14.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: links; Type: TABLE; Schema: public; Owner: dtmisowuijqulk
--

CREATE TABLE public.links (
    id integer NOT NULL,
    url text NOT NULL,
    title text,
    text text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "viewedAt" timestamp(3) without time zone
);


ALTER TABLE public.links OWNER TO dtmisowuijqulk;

--
-- Name: links_id_seq; Type: SEQUENCE; Schema: public; Owner: dtmisowuijqulk
--

CREATE SEQUENCE public.links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.links_id_seq OWNER TO dtmisowuijqulk;

--
-- Name: links_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dtmisowuijqulk
--

ALTER SEQUENCE public.links_id_seq OWNED BY public.links.id;


--
-- Name: links id; Type: DEFAULT; Schema: public; Owner: dtmisowuijqulk
--

ALTER TABLE ONLY public.links ALTER COLUMN id SET DEFAULT nextval('public.links_id_seq'::regclass);


--
-- Data for Name: links; Type: TABLE DATA; Schema: public; Owner: dtmisowuijqulk
--

COPY public.links (id, url, title, text, "createdAt", "viewedAt") FROM stdin;
1	https://news.ycombinator.com/item?id=30883015	A Database for 2022 | Hacker News	\N	2022-04-02 13:22:35.82	2022-04-03 15:33:43.72
2	https://github.com/barthr/redo	GitHub - barthr/redo: Redo is the ultimate tool to create aliases from your history in an interactive way	\N	2022-04-02 13:22:53.004	2022-04-03 15:40:32.305
3	https://github.com/jaredpalmer/tsdx	GitHub - jaredpalmer/tsdx: Zero-config CLI for TypeScript package development	\N	2022-04-02 13:25:45.865	2022-04-03 15:41:34.019
4	https://github.com/benbjohnson/postlite	GitHub - benbjohnson/postlite: Postgres wire compatible SQLite proxy.	\N	2022-04-02 13:25:58.623	2022-04-03 15:43:02.651
6	https://expose.sh/	Expose.sh - Expose localhost to the web	https://expose.sh/	2022-04-02 21:12:59.144	2022-04-03 15:45:43.439
7	https://news.ycombinator.com/item?id=30891494	Roll your own Ngrok with Nginx, Letsencrypt, and SSH reverse tunnelling | Hacker News	https://news.ycombinator.com/item?id=30891494	2022-04-03 03:32:08.793	2022-04-03 15:47:34.144
8	https://github.com/sqlfluff/sqlfluff	GitHub - sqlfluff/sqlfluff: A SQL linter and auto-formatter for Humans	https://github.com/sqlfluff/sqlfluff	2022-04-03 03:32:08.809	2022-04-03 15:50:29.042
9	https://github.com/OpenBB-finance/OpenBBTerminal	GitHub - OpenBB-finance/OpenBBTerminal: Investment Research for Everyone.	https://github.com/OpenBB-finance/OpenBBTerminal	2022-04-03 03:32:08.817	2022-04-03 15:54:58.81
10	https://www.sakowi.cz/blog/cloudflared-docker-compose-tutorial	No more VPN. Introducting Cloudflare Tunnel // Szymon Sakowicz	https://www.sakowi.cz/blog/cloudflared-docker-compose-tutorial	2022-04-03 03:32:08.833	2022-04-03 22:21:54.962
\.


--
-- Name: links_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dtmisowuijqulk
--

SELECT pg_catalog.setval('public.links_id_seq', 10, true);


--
-- Name: links links_pkey; Type: CONSTRAINT; Schema: public; Owner: dtmisowuijqulk
--

ALTER TABLE ONLY public.links
    ADD CONSTRAINT links_pkey PRIMARY KEY (id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: dtmisowuijqulk
--

REVOKE ALL ON SCHEMA public FROM postgres;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO dtmisowuijqulk;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- Name: LANGUAGE plpgsql; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON LANGUAGE plpgsql TO dtmisowuijqulk;


--
-- PostgreSQL database dump complete
--

