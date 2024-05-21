--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3 (Debian 16.3-1.pgdg120+1)
-- Dumped by pg_dump version 16.2

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

--
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA drizzle;


ALTER SCHEMA drizzle OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: __drizzle_migrations; Type: TABLE; Schema: drizzle; Owner: postgres
--

CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);


ALTER TABLE drizzle.__drizzle_migrations OWNER TO postgres;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE; Schema: drizzle; Owner: postgres
--

CREATE SEQUENCE drizzle.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNER TO postgres;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: postgres
--

ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;


--
-- Name: bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookings (
    id integer NOT NULL,
    location character varying,
    cost numeric,
    scheduled_time time without time zone,
    start_date date,
    end_date date,
    booked_by_id integer,
    name character varying NOT NULL,
    num_players integer DEFAULT 14 NOT NULL,
    whatsapp_group_jid character varying,
    announce_name character varying,
    cost_per_player numeric,
    num_goalies integer DEFAULT 2 NOT NULL,
    cost_per_goalie numeric DEFAULT '0'::numeric NOT NULL,
    notify_group boolean DEFAULT false NOT NULL,
    slug character varying NOT NULL
);


ALTER TABLE public.bookings OWNER TO postgres;

--
-- Name: bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bookings_id_seq OWNER TO postgres;

--
-- Name: bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bookings_id_seq OWNED BY public.bookings.id;


--
-- Name: players; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.players (
    id integer NOT NULL,
    full_name character varying(256) NOT NULL,
    email character varying,
    phone_number character varying,
    admin boolean DEFAULT false NOT NULL,
    skill_level_letter character varying,
    nickname character varying(256),
    date_added timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    notes text,
    is_player boolean DEFAULT true NOT NULL,
    is_goalie boolean DEFAULT false NOT NULL,
    clerk_user_id character varying,
    skill_level integer
);


ALTER TABLE public.players OWNER TO postgres;

--
-- Name: players_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.players_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.players_id_seq OWNER TO postgres;

--
-- Name: players_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.players_id_seq OWNED BY public.players.id;


--
-- Name: players_to_bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.players_to_bookings (
    player_id integer NOT NULL,
    booking_id integer NOT NULL,
    amount_paid numeric,
    "position" character varying DEFAULT 'Player'::character varying NOT NULL
);


ALTER TABLE public.players_to_bookings OWNER TO postgres;

--
-- Name: players_to_skates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.players_to_skates (
    player_id integer NOT NULL,
    skate_id integer NOT NULL,
    team character varying,
    substitute_player_id integer,
    dropped_out_on timestamp without time zone,
    "position" character varying DEFAULT 'Player'::character varying NOT NULL,
    added_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    id integer NOT NULL,
    paid boolean DEFAULT false NOT NULL
);


ALTER TABLE public.players_to_skates OWNER TO postgres;

--
-- Name: players_to_skates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.players_to_skates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.players_to_skates_id_seq OWNER TO postgres;

--
-- Name: players_to_skates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.players_to_skates_id_seq OWNED BY public.players_to_skates.id;


--
-- Name: skates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.skates (
    id integer NOT NULL,
    scheduled_on timestamp without time zone NOT NULL,
    booking_id integer NOT NULL,
    slug character varying
);


ALTER TABLE public.skates OWNER TO postgres;

--
-- Name: skates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.skates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.skates_id_seq OWNER TO postgres;

--
-- Name: skates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.skates_id_seq OWNED BY public.skates.id;


--
-- Name: whatsapp_auth; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.whatsapp_auth (
    key character varying NOT NULL,
    data json
);


ALTER TABLE public.whatsapp_auth OWNER TO postgres;

--
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: drizzle; Owner: postgres
--

ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);


--
-- Name: bookings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings ALTER COLUMN id SET DEFAULT nextval('public.bookings_id_seq'::regclass);


--
-- Name: players id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players ALTER COLUMN id SET DEFAULT nextval('public.players_id_seq'::regclass);


--
-- Name: players_to_skates id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players_to_skates ALTER COLUMN id SET DEFAULT nextval('public.players_to_skates_id_seq'::regclass);


--
-- Name: skates id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skates ALTER COLUMN id SET DEFAULT nextval('public.skates_id_seq'::regclass);


--
-- Data for Name: __drizzle_migrations; Type: TABLE DATA; Schema: drizzle; Owner: postgres
--

COPY drizzle.__drizzle_migrations (id, hash, created_at) FROM stdin;
1	156483f38ad93f84fa44412712cfff5458ed333ea46b9b2963e9fa2fb32ca9ce	1711484702192
2	5c5e3c5dd8cae49fd8bff5d2f7bccb730a67f1d4d7748fbaa1b2d70065253fa3	1711485632878
3	aaaab2e4e0f6cf45740b4d12b2c88e56b3026a75b6443413f9de991b4954aab4	1711496091705
4	3d12e71244121e3f5d04bc65658b71447c917b684799c58d33868fbbf4cde8df	1711505801040
5	b3f2b7d38a618cb0900196b5ad56bc4c4cf16c5166b9850e0df69a321b2e28e9	1711509327693
6	1f293d6765add1ee309d7e27219657cea42fca886fac8b25842db3762d99b9b1	1711598588017
7	ac7062f59009af9b207248d51a58029ce17d58871def4ac73ee18fb20254bb77	1711634729516
8	9e38bf3e859b3c56d488a409b8c5e9b433509a093c4ef4afbae9d53f6c646baa	1711640249227
9	98970fa274334524e1268a577e191414fa31c389b4ffa57ddba58664a6bb31d2	1711660528740
10	ef0aaa3397bea221bc5377abb56e3aec4204ebc136512b926ac8221ee4467624	1711663522873
11	fa6246d71ebb918e8810744277e69a6a9cd53e966dc3c1a483bf19f177cfbde5	1711664280188
12	0859decd07187f75b9a9b051c926dbd200534ce6a9db9b6202884a115c8f3e34	1711680014606
13	ceb2bcdb7e0367f97184da86bdf8c587b367aff4d4901fdf96581fc9866e61e6	1711727769617
14	bb58e8d0d10805f81d78c2d08e84f8dc365f6ce1eed3db63084a3ca2f661ed53	1711745577125
15	7cc3e1e3b029a3cd56e27978a2f453d25457bd86fcc3d6a1b9da515ba676c518	1712099899076
16	3121f1498d2f902dc467bd069ad6bf8fb64d997087ffcd112655ce3c7ddae24b	1712110170137
17	6e0bb2f65c129d42e915a0ac96e36ed8ea3884c293bd702d9daccac61843a0d9	1712167365300
18	4f92fcb4f998e94dfdddbfd68cc5bd82888ce391eee769d0be2fd1d3dde6dcc7	1712167752375
19	2b43be55d59602211f993a14035ff97de3e6796871f17e44190b1c82581d0911	1712167777951
20	6e0bb2f65c129d42e915a0ac96e36ed8ea3884c293bd702d9daccac61843a0d9	1712167795444
21	d9c2325ea7e63f8e6ffde8f3451ae53c34d932162a53c5e3b7630e84a97c1770	1712688249115
22	b5c0f4094b8cbb4555bd57edaaa0d4e0891124d93f4ebc21faa95f8d1fbb5a74	1712690521796
23	eecec12705e0137defdb630e780cbee7107079e9c692a8c7b012e0623e44053f	1712717945078
24	ecad070ff05695b1f0f6b9197d252225d0dcca738f8fcc4c5b868115e8183910	1712770564466
25	f007535ab64d7300b6ffd27d44ecc4f9b04fcf7d7d31334c550a701ea0b164e2	1712771906219
26	981570221251f7fca5bf0394c200232d7b52fa065cd14fdffb6ed55e067436d5	1712772658328
27	74b19cc9553d28fa989ffdad7eb575693f8e2f277fc7101cc0fd09ec66a2238b	1712928931861
28	86cbf3fb9b7ee268bc144ca69eae1499b8f7fbf5fb8727cc05a20d9580e61282	1712930143233
29	2fe0a3e4609eb95e2544f14c33ded2c24cbe88f2555549c30df0904495e9f56c	1712930869424
30	4b665d05e8d88ec30490396749874d3255661f897d67d2e50d8a014e92dabf9f	1712938458302
31	7b56dc14f8ab44dfc3ff113fbb7efde6717b2b6962f7ea5d8a0486f95691277c	1712939486040
32	1ce952e1a317abba7d9bf0fef54a5e02ac0b40b8252ef07d3556f363eb5f6c4b	1713220381977
33	4df459fc42d0536f24e38bdd7af2f278546dbfcc3b03248ec4a4f23c0476dcda	1715537059290
34	79b4a8b6cbe5f212bf2f2d0a680a38e28a35179f87cce3c49575b67c4cb04dd1	1715537703109
35	ce55b85511f1f3354fd1f011ea53cba5e491003355a209da35fdbbe9476355b7	1715607180030
36	df6469136d8f0112b3614991359b910b49ccac9accee06b3c00e4f295657f5e1	1715740425147
\.


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bookings (id, location, cost, scheduled_time, start_date, end_date, booked_by_id, name, num_players, whatsapp_group_jid, announce_name, cost_per_player, num_goalies, cost_per_goalie, notify_group, slug) FROM stdin;
13	NTR Richmond Hill	1333.4	21:30:00	2024-04-03	2024-04-24	1	NTR 3 on 3 Wednesdays (Apr 2024)	14	120363040442913900@g.us	NTR 3 on 3 Wed	100	2	0	t	wed-apr2024
14	NTR Richmond Hill	6000.3	20:45:00	2024-01-01	2024-04-29	1	NTR 3 on 3 Mondays (Apr 2024)	14	120363040442913900@g.us	NTR 3 on 3 Mon	375	2	0	t	mon-apr2024
15	NTR Richmond Hill	4666.9	20:45:00	2024-05-06	2024-08-26	1	NTR 3 on 3 Mondays (May-Aug 2024)	14	120363040442913900@g.us	NTR 3 on 3 Mon	350	2	0	t	mon-may2024
16	NTR Richmond Hill	1666.75	21:30:00	2024-05-01	2024-05-29	1	NTR 3 on 3 Wednesdays (May 2024)	14	120363040442913900@g.us	NTR 3 on 3 Wed	125	2	0	t	wed-may2024
\.


--
-- Data for Name: players; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.players (id, full_name, email, phone_number, admin, skill_level_letter, nickname, date_added, notes, is_player, is_goalie, clerk_user_id, skill_level) FROM stdin;
12	Andrew Maclean	dobe.maclean@gmail.com	+16475189937	f	A	Andrew M	2024-03-29 12:53:27.518206	\N	t	f	\N	\N
15	Richard Polonsky	cskamoskva@yahoo.com	+16473881083	f	A	Rich	2024-03-29 13:01:59.729515	\N	t	f	\N	\N
16	Chris Chau	christopher.m.chau@gmail.com	+14166272800	f	A	Chris C	2024-04-02 20:08:52.591174	\N	t	f	\N	\N
17	Mark Botelho	mark.tyler.bot@gmail.com	+14166604828	f	A	Mark	2024-04-02 22:08:40.316804	\N	t	f	\N	\N
45	Kal	kal@idunno.com	+14166666661	f	A	Kal	2024-04-24 20:50:43.856541	\N	t	f	\N	\N
37	Ben	ben@idunno.com	+14168379774	f	A	Ben	2024-04-10 20:35:35.603355	Quang's kid	t	f	\N	\N
14	Dylan Bal	dylan.bal@dasblaw.com	+16479948958	f	D	Baller	2024-03-29 12:59:22.35096	\N	t	f	\N	\N
20	Adrian Fisher-Fleming	adrianff@gmail.com	+14165189361	f	D	Adrian	2024-04-09 17:48:32.318106	\N	t	f	\N	\N
21	Sasha Al-Joundi	sasha.aljoundi@gmail.com	+14165590095	f	C	Sasha	2024-04-09 17:50:21.864931	\N	t	f	\N	\N
22	John Tan	johnwarrick.tan@gmail.com	+16473398238	f	A	JT	2024-04-09 17:54:04.455605	\N	t	f	\N	\N
23	Michael Godin	mmgodin@rogers.com	+14164554091	f	C	Michael	2024-04-09 17:55:20.229045	\N	t	f	\N	\N
24	Andrew Tso	andrew.tso@rogers.com	+14164730680	f	C	Andrew T	2024-04-09 18:06:41.597414	\N	t	f	\N	\N
25	Greg Greene	greggreene1367@gmail.com	+19058723311	f	A	Greener	2024-04-09 18:16:14.102914	\N	t	f	\N	\N
26	Kelvin Chan	kkfchan@gmail.com	+16479984205	f	D	Kelvin	2024-04-09 18:17:07.543228	\N	t	f	\N	\N
27	Jeremy Boudreau	jwboudre@hotmail.com	+14164334833	f	D	Jeremy	2024-04-09 18:18:23.403306	\N	t	f	\N	\N
31	Ryo Van Schoonhoven	jasonvan8@gmail.com	+19059558205	f	A	Ryo	2024-04-09 18:28:19.684925	\N	t	f	\N	\N
48	Quang	quan@idunno.com	+14168379773	f	A	Quan	2024-04-24 20:53:17.462609	\N	t	f	\N	\N
35	Oliver Jones	oliver.tkd@icloud.com	+16475634038	f	A	Oli	2024-04-10 17:47:06.735137	\N	t	t	\N	\N
32	Jones	jones@idunno.com	+16479822776	f	C	Jones	2024-04-10 17:44:26.161778	\N	t	t	\N	\N
34	Shaun	shaun@idunno.com	+16475055327	f	B	Shaun	2024-04-10 17:46:13.191576	\N	f	t	\N	\N
33	Randy	randy@idunno.com	+16477108956	f	B	Randy	2024-04-10 17:45:22.989584	\N	f	t	\N	\N
36	Andrew Iaquinta	andrewiaquinta@gmail.com	+16475192906	f	A	Andrew I	2024-04-10 19:22:10.825928	\N	t	f	\N	\N
38	Imy P	imy@idunno.com	+14168046727	f	B	Imy	2024-04-11 22:15:42.211538	\N	t	f	\N	\N
39	John Suh	johnsuh@idunno.com	+16473852193	f	A	\N	2024-04-11 22:16:34.187993	\N	t	f	\N	\N
51	Adam Holt	adam@idunno.com	+16473267188	f	B	Adam	2024-04-29 21:50:19.838998	\N	t	f	\N	\N
30	Rahim Kassam	rkassam22@hotmail.com	+14167164979	f	A	Kassam	2024-04-09 18:23:06.876873	\N	t	f	\N	\N
40	Thomas Vandree	itstommyvanderee@gmail.com	+14165738774	f	B	Thomas	2024-04-15 14:51:42.750251	\N	t	f	\N	\N
41	JC	jc@idunno.com	+16476211305	f	A	JC	2024-04-17 20:48:16.457042	\N	t	t	\N	\N
18	Anthony Tse	tse.anthony@gmail.com	+14163881327	f	A	Anthony	2024-04-02 22:11:58.524018	Rich’s friend	t	f	\N	\N
42	Jenny	jenny@idunno.com	+14162222222	f	A	Jenny	2024-04-19 16:13:20.592243	Andrew M gf	t	f	\N	\N
43	Daniel Lam	dlam2292@gmail.com	+14168246218	f	A	Daniel	2024-04-24 16:03:44.080066	\N	t	f	\N	\N
44	Greg	greg@idunno.com	+12892643403	f	A	Greg (Rich's friend)	2024-04-24 20:50:11.374001	Rich's friend	t	f	\N	\N
52	Cal	cal@idunno.com	+14164972947	f	A	Cal	2024-05-08 13:30:27.042356	\N	f	t	\N	\N
50	Vedula Anand Adeep	anand.vedula@aol.com	+16472841085	f	D	Anand	2024-04-29 16:56:13.129474	Anthony's friend	t	f	\N	\N
53	Faizal Karmali	faizk73@hotmail.com	+14168993622	f	D	Popo	2024-05-12 13:26:03.193755	\N	t	f	\N	\N
19	Bradley Toms	brad_toms@hotmail.com	+12893384691	f	\N	Brad	2024-04-02 22:13:08.767326	Rich's friend	t	f	\N	\N
1	Josh Kay	josh.m.kay@gmail.com	+14164644510	t	A	Josh	2024-03-29 02:40:17.893872	\N	t	f	user_2gQ3STVG0vzuGG98XDzuZX0KvRI	11
54	Nino	nino@idunno.com	+19059059055	f	\N	Nino	2024-05-16 00:24:50.333388	Alim H's friend	f	t	\N	5
55	Ahad	ahad@idunno.com	+19059059056	f	\N	Ahad	2024-05-16 00:25:55.082385	Alim H's friend	t	f	\N	5
4	Alim Hirji	alimhirji@rogers.com	+16475355779	f	A	\N	2024-03-29 02:40:17.893872	\N	t	f	\N	4
11	Alim Kanji	kanji.alim@gmail.com	+16473381134	f	D	Alim K	2024-03-29 05:07:31.830438	\N	t	f	\N	1
2	Rahim Karsan	rkarsan@hotmail.com	+14168798485	f	B	Rahim	2024-03-29 02:40:17.893872	\N	t	f	\N	2
3	Brent Rowe	brentrowe0@gmail.com	+19059601153	f	A	Brent	2024-03-29 02:40:17.893872	\N	t	f	\N	3
5	Jason Lam	jasonlam99@yahoo.com	+14162009440	f	A	\N	2024-03-29 02:40:17.893872	\N	t	f	\N	5
6	Justin Sim	jsimhba2003@yahoo.ca	+14165266435	f	A	Justin	2024-03-29 02:40:17.893872	\N	t	f	\N	6
7	Sam Sefidrouh	sam.sefidrouh@gmail.com	+16473022552	f	B	Sam	2024-03-29 02:40:17.893872	\N	t	f	\N	7
8	Hussain Dhalla	hussaindhalla@gmail.com	+16472185115	f	B	Tubes	2024-03-29 02:40:17.893872	\N	t	f	\N	8
9	Sadek Fahmy	sadek.fahmy@outlook.com	+14168216110	f	B	Sadek	2024-03-29 02:40:17.893872	\N	t	f	\N	9
\.


--
-- Data for Name: players_to_bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.players_to_bookings (player_id, booking_id, amount_paid, "position") FROM stdin;
17	16	125	Player
1	13	100	Player
17	13	100	Player
17	15	350	Player
3	13	100	Player
4	13	100	Player
5	13	100	Player
7	13	100	Player
8	13	100	Player
11	13	100	Player
15	13	100	Player
16	13	100	Player
18	13	100	Player
19	13	100	Player
9	13	100	Player
21	15	350	Player
6	13	100	Player
31	14	375	Player
26	14	375	Player
1	14	375	Player
2	14	375	Player
11	14	375	Player
17	14	375	Player
20	14	375	Player
21	14	375	Player
22	14	375	Player
23	14	375	Player
24	14	375	Player
25	14	375	Player
27	14	375	Player
30	14	375	Player
32	13	\N	Goalie
34	13	\N	Goalie
35	14	\N	Goalie
32	14	\N	Goalie
25	15	\N	Player
35	15	\N	Goalie
32	15	\N	Goalie
1	15	350	Player
23	15	350	Player
24	15	350	Player
27	15	350	Player
30	15	350	Player
32	16	\N	Goalie
34	16	\N	Goalie
7	16	125	Player
1	16	125	Player
15	16	125	Player
20	15	350	Player
26	15	350	Player
3	16	125	Player
5	16	125	Player
18	16	125	Player
31	15	350	Player
6	16	125	Player
4	16	125	Player
50	16	125	Player
11	16	125	Player
2	16	125	Player
43	16	125	Player
11	15	350	Player
2	15	350	Player
22	15	350	Player
\.


--
-- Data for Name: players_to_skates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.players_to_skates (player_id, skate_id, team, substitute_player_id, dropped_out_on, "position", added_on, id, paid) FROM stdin;
1	31	\N	\N	\N	Player	2024-04-12 14:07:51.123252	1	f
17	31	\N	\N	\N	Player	2024-04-12 14:07:51.123252	2	f
3	31	\N	\N	\N	Player	2024-04-12 14:07:51.123252	3	f
4	31	\N	\N	\N	Player	2024-04-12 14:07:51.123252	4	f
5	31	\N	\N	\N	Player	2024-04-12 14:07:51.123252	5	f
7	31	\N	\N	\N	Player	2024-04-12 14:07:51.123252	6	f
8	31	\N	\N	\N	Player	2024-04-12 14:07:51.123252	7	f
11	31	\N	\N	\N	Player	2024-04-12 14:07:51.123252	8	f
15	31	\N	\N	\N	Player	2024-04-12 14:07:51.123252	9	f
16	31	\N	\N	\N	Player	2024-04-12 14:07:51.123252	10	f
18	31	\N	\N	\N	Player	2024-04-12 14:07:51.123252	11	f
19	31	\N	\N	\N	Player	2024-04-12 14:07:51.123252	12	f
9	31	\N	\N	\N	Player	2024-04-12 14:07:51.123252	13	f
6	31	\N	\N	\N	Player	2024-04-12 14:07:51.123252	14	f
31	6	\N	\N	\N	Player	2024-04-12 14:07:51.123252	15	f
26	6	\N	\N	\N	Player	2024-04-12 14:07:51.123252	16	f
1	6	\N	\N	\N	Player	2024-04-12 14:07:51.123252	31	f
31	7	\N	\N	\N	Player	2024-04-12 14:07:51.123252	46	f
26	7	\N	\N	\N	Player	2024-04-12 14:07:51.123252	47	f
1	7	\N	\N	\N	Player	2024-04-12 14:07:51.123252	48	f
31	8	\N	\N	\N	Player	2024-04-12 14:07:51.123252	49	f
26	8	\N	\N	\N	Player	2024-04-12 14:07:51.123252	50	f
1	8	\N	\N	\N	Player	2024-04-12 14:07:51.123252	51	f
31	9	\N	\N	\N	Player	2024-04-12 14:07:51.123252	52	f
26	9	\N	\N	\N	Player	2024-04-12 14:07:51.123252	53	f
1	9	\N	\N	\N	Player	2024-04-12 14:07:51.123252	54	f
31	10	\N	\N	\N	Player	2024-04-12 14:07:51.123252	55	f
26	10	\N	\N	\N	Player	2024-04-12 14:07:51.123252	56	f
1	10	\N	\N	\N	Player	2024-04-12 14:07:51.123252	57	f
31	11	\N	\N	\N	Player	2024-04-12 14:07:51.123252	58	f
26	11	\N	\N	\N	Player	2024-04-12 14:07:51.123252	59	f
1	11	\N	\N	\N	Player	2024-04-12 14:07:51.123252	60	f
31	12	\N	\N	\N	Player	2024-04-12 14:07:51.123252	61	f
26	12	\N	\N	\N	Player	2024-04-12 14:07:51.123252	62	f
1	12	\N	\N	\N	Player	2024-04-12 14:07:51.123252	63	f
31	13	\N	\N	\N	Player	2024-04-12 14:07:51.123252	64	f
26	13	\N	\N	\N	Player	2024-04-12 14:07:51.123252	65	f
1	13	\N	\N	\N	Player	2024-04-12 14:07:51.123252	66	f
31	14	\N	\N	\N	Player	2024-04-12 14:07:51.123252	67	f
26	14	\N	\N	\N	Player	2024-04-12 14:07:51.123252	68	f
1	14	\N	\N	\N	Player	2024-04-12 14:07:51.123252	69	f
31	15	\N	\N	\N	Player	2024-04-12 14:07:51.123252	70	f
26	15	\N	\N	\N	Player	2024-04-12 14:07:51.123252	71	f
1	15	\N	\N	\N	Player	2024-04-12 14:07:51.123252	72	f
31	16	\N	\N	\N	Player	2024-04-12 14:07:51.123252	73	f
26	16	\N	\N	\N	Player	2024-04-12 14:07:51.123252	74	f
1	16	\N	\N	\N	Player	2024-04-12 14:07:51.123252	75	f
31	17	\N	\N	\N	Player	2024-04-12 14:07:51.123252	76	f
26	17	\N	\N	\N	Player	2024-04-12 14:07:51.123252	77	f
1	17	\N	\N	\N	Player	2024-04-12 14:07:51.123252	78	f
31	18	\N	\N	\N	Player	2024-04-12 14:07:51.123252	79	f
26	18	\N	\N	\N	Player	2024-04-12 14:07:51.123252	80	f
1	18	\N	\N	\N	Player	2024-04-12 14:07:51.123252	81	f
31	19	\N	\N	\N	Player	2024-04-12 14:07:51.123252	82	f
26	19	\N	\N	\N	Player	2024-04-12 14:07:51.123252	83	f
1	19	\N	\N	\N	Player	2024-04-12 14:07:51.123252	84	f
31	5	\N	\N	\N	Player	2024-04-12 14:07:51.123252	91	f
26	5	\N	\N	\N	Player	2024-04-12 14:07:51.123252	92	f
1	5	\N	\N	\N	Player	2024-04-12 14:07:51.123252	93	f
2	6	\N	\N	\N	Player	2024-04-12 14:07:51.123252	94	f
11	6	\N	\N	\N	Player	2024-04-12 14:07:51.123252	95	f
17	6	\N	\N	\N	Player	2024-04-12 14:07:51.123252	96	f
20	6	\N	\N	\N	Player	2024-04-12 14:07:51.123252	97	f
21	6	\N	\N	\N	Player	2024-04-12 14:07:51.123252	98	f
22	6	\N	\N	\N	Player	2024-04-12 14:07:51.123252	99	f
23	6	\N	\N	\N	Player	2024-04-12 14:07:51.123252	100	f
24	6	\N	\N	\N	Player	2024-04-12 14:07:51.123252	101	f
25	6	\N	\N	\N	Player	2024-04-12 14:07:51.123252	102	f
27	6	\N	\N	\N	Player	2024-04-12 14:07:51.123252	103	f
30	6	\N	\N	\N	Player	2024-04-12 14:07:51.123252	104	f
2	7	\N	\N	\N	Player	2024-04-12 14:07:51.123252	105	f
11	7	\N	\N	\N	Player	2024-04-12 14:07:51.123252	106	f
17	7	\N	\N	\N	Player	2024-04-12 14:07:51.123252	107	f
20	7	\N	\N	\N	Player	2024-04-12 14:07:51.123252	108	f
21	7	\N	\N	\N	Player	2024-04-12 14:07:51.123252	109	f
22	7	\N	\N	\N	Player	2024-04-12 14:07:51.123252	110	f
23	7	\N	\N	\N	Player	2024-04-12 14:07:51.123252	111	f
24	7	\N	\N	\N	Player	2024-04-12 14:07:51.123252	112	f
25	7	\N	\N	\N	Player	2024-04-12 14:07:51.123252	113	f
27	7	\N	\N	\N	Player	2024-04-12 14:07:51.123252	114	f
30	7	\N	\N	\N	Player	2024-04-12 14:07:51.123252	115	f
2	8	\N	\N	\N	Player	2024-04-12 14:07:51.123252	116	f
11	8	\N	\N	\N	Player	2024-04-12 14:07:51.123252	117	f
17	8	\N	\N	\N	Player	2024-04-12 14:07:51.123252	118	f
20	8	\N	\N	\N	Player	2024-04-12 14:07:51.123252	119	f
21	8	\N	\N	\N	Player	2024-04-12 14:07:51.123252	120	f
22	8	\N	\N	\N	Player	2024-04-12 14:07:51.123252	121	f
23	8	\N	\N	\N	Player	2024-04-12 14:07:51.123252	122	f
24	8	\N	\N	\N	Player	2024-04-12 14:07:51.123252	123	f
25	8	\N	\N	\N	Player	2024-04-12 14:07:51.123252	124	f
27	8	\N	\N	\N	Player	2024-04-12 14:07:51.123252	125	f
30	8	\N	\N	\N	Player	2024-04-12 14:07:51.123252	126	f
2	9	\N	\N	\N	Player	2024-04-12 14:07:51.123252	127	f
11	9	\N	\N	\N	Player	2024-04-12 14:07:51.123252	128	f
17	9	\N	\N	\N	Player	2024-04-12 14:07:51.123252	129	f
20	9	\N	\N	\N	Player	2024-04-12 14:07:51.123252	130	f
21	9	\N	\N	\N	Player	2024-04-12 14:07:51.123252	131	f
22	9	\N	\N	\N	Player	2024-04-12 14:07:51.123252	132	f
23	9	\N	\N	\N	Player	2024-04-12 14:07:51.123252	133	f
24	9	\N	\N	\N	Player	2024-04-12 14:07:51.123252	134	f
25	9	\N	\N	\N	Player	2024-04-12 14:07:51.123252	135	f
27	9	\N	\N	\N	Player	2024-04-12 14:07:51.123252	136	f
9	34	\N	37	2024-04-24 13:21:40.809	Player	2024-04-12 14:07:51.123252	44	f
17	33	black	\N	\N	Player	2024-04-12 14:07:51.123252	18	f
31	22	white	\N	2024-04-29 23:08:48.233	Player	2024-04-12 14:07:51.123252	88	f
5	34	black	\N	\N	Player	2024-04-12 14:07:51.123252	36	f
1	21	\N	42	2024-04-19 14:31:28.677	Player	2024-04-12 14:07:51.123252	87	f
31	21	black	\N	\N	Player	2024-04-12 14:07:51.123252	85	f
26	21	black	\N	\N	Player	2024-04-12 14:07:51.123252	86	f
8	34	\N	44	2024-04-19 14:57:16.708	Player	2024-04-12 14:07:51.123252	38	f
19	34	\N	48	2024-04-24 16:04:28.875	Player	2024-04-12 14:07:51.123252	43	f
1	34	\N	43	2024-04-19 14:32:05.703	Player	2024-04-12 14:07:51.123252	32	f
6	34	\N	45	2024-04-19 21:37:37.937	Player	2024-04-12 14:07:51.123252	45	f
17	34	black	\N	\N	Player	2024-04-12 14:07:51.123252	33	f
3	34	black	\N	\N	Player	2024-04-12 14:07:51.123252	34	f
18	34	white	\N	\N	Player	2024-04-12 14:07:51.123252	42	f
15	34	white	\N	\N	Player	2024-04-12 14:07:51.123252	40	f
4	34	white	\N	\N	Player	2024-04-12 14:07:51.123252	35	f
1	22	white	\N	\N	Player	2024-04-12 14:07:51.123252	90	f
26	22	white	\N	\N	Player	2024-04-12 14:07:51.123252	89	f
30	9	\N	\N	\N	Player	2024-04-12 14:07:51.123252	137	f
2	10	\N	\N	\N	Player	2024-04-12 14:07:51.123252	138	f
11	10	\N	\N	\N	Player	2024-04-12 14:07:51.123252	139	f
17	10	\N	\N	\N	Player	2024-04-12 14:07:51.123252	140	f
20	10	\N	\N	\N	Player	2024-04-12 14:07:51.123252	141	f
21	10	\N	\N	\N	Player	2024-04-12 14:07:51.123252	142	f
22	10	\N	\N	\N	Player	2024-04-12 14:07:51.123252	143	f
23	10	\N	\N	\N	Player	2024-04-12 14:07:51.123252	144	f
24	10	\N	\N	\N	Player	2024-04-12 14:07:51.123252	145	f
25	10	\N	\N	\N	Player	2024-04-12 14:07:51.123252	146	f
27	10	\N	\N	\N	Player	2024-04-12 14:07:51.123252	147	f
30	10	\N	\N	\N	Player	2024-04-12 14:07:51.123252	148	f
2	11	\N	\N	\N	Player	2024-04-12 14:07:51.123252	149	f
11	11	\N	\N	\N	Player	2024-04-12 14:07:51.123252	150	f
17	11	\N	\N	\N	Player	2024-04-12 14:07:51.123252	151	f
20	11	\N	\N	\N	Player	2024-04-12 14:07:51.123252	152	f
21	11	\N	\N	\N	Player	2024-04-12 14:07:51.123252	153	f
22	11	\N	\N	\N	Player	2024-04-12 14:07:51.123252	154	f
23	11	\N	\N	\N	Player	2024-04-12 14:07:51.123252	155	f
24	11	\N	\N	\N	Player	2024-04-12 14:07:51.123252	156	f
25	11	\N	\N	\N	Player	2024-04-12 14:07:51.123252	157	f
27	11	\N	\N	\N	Player	2024-04-12 14:07:51.123252	158	f
30	11	\N	\N	\N	Player	2024-04-12 14:07:51.123252	159	f
2	12	\N	\N	\N	Player	2024-04-12 14:07:51.123252	160	f
11	12	\N	\N	\N	Player	2024-04-12 14:07:51.123252	161	f
17	12	\N	\N	\N	Player	2024-04-12 14:07:51.123252	162	f
20	12	\N	\N	\N	Player	2024-04-12 14:07:51.123252	163	f
21	12	\N	\N	\N	Player	2024-04-12 14:07:51.123252	164	f
22	12	\N	\N	\N	Player	2024-04-12 14:07:51.123252	165	f
23	12	\N	\N	\N	Player	2024-04-12 14:07:51.123252	166	f
24	12	\N	\N	\N	Player	2024-04-12 14:07:51.123252	167	f
25	12	\N	\N	\N	Player	2024-04-12 14:07:51.123252	168	f
27	12	\N	\N	\N	Player	2024-04-12 14:07:51.123252	169	f
30	12	\N	\N	\N	Player	2024-04-12 14:07:51.123252	170	f
2	13	\N	\N	\N	Player	2024-04-12 14:07:51.123252	171	f
11	13	\N	\N	\N	Player	2024-04-12 14:07:51.123252	172	f
17	13	\N	\N	\N	Player	2024-04-12 14:07:51.123252	173	f
20	13	\N	\N	\N	Player	2024-04-12 14:07:51.123252	174	f
21	13	\N	\N	\N	Player	2024-04-12 14:07:51.123252	175	f
22	13	\N	\N	\N	Player	2024-04-12 14:07:51.123252	176	f
23	13	\N	\N	\N	Player	2024-04-12 14:07:51.123252	177	f
24	13	\N	\N	\N	Player	2024-04-12 14:07:51.123252	178	f
25	13	\N	\N	\N	Player	2024-04-12 14:07:51.123252	179	f
27	13	\N	\N	\N	Player	2024-04-12 14:07:51.123252	180	f
30	13	\N	\N	\N	Player	2024-04-12 14:07:51.123252	181	f
2	14	\N	\N	\N	Player	2024-04-12 14:07:51.123252	182	f
11	14	\N	\N	\N	Player	2024-04-12 14:07:51.123252	183	f
17	14	\N	\N	\N	Player	2024-04-12 14:07:51.123252	184	f
20	14	\N	\N	\N	Player	2024-04-12 14:07:51.123252	185	f
21	14	\N	\N	\N	Player	2024-04-12 14:07:51.123252	186	f
22	14	\N	\N	\N	Player	2024-04-12 14:07:51.123252	187	f
23	14	\N	\N	\N	Player	2024-04-12 14:07:51.123252	188	f
24	14	\N	\N	\N	Player	2024-04-12 14:07:51.123252	189	f
25	14	\N	\N	\N	Player	2024-04-12 14:07:51.123252	190	f
27	14	\N	\N	\N	Player	2024-04-12 14:07:51.123252	191	f
30	14	\N	\N	\N	Player	2024-04-12 14:07:51.123252	192	f
2	15	\N	\N	\N	Player	2024-04-12 14:07:51.123252	193	f
11	15	\N	\N	\N	Player	2024-04-12 14:07:51.123252	194	f
17	15	\N	\N	\N	Player	2024-04-12 14:07:51.123252	195	f
20	15	\N	\N	\N	Player	2024-04-12 14:07:51.123252	196	f
21	15	\N	\N	\N	Player	2024-04-12 14:07:51.123252	197	f
22	15	\N	\N	\N	Player	2024-04-12 14:07:51.123252	198	f
23	15	\N	\N	\N	Player	2024-04-12 14:07:51.123252	199	f
24	15	\N	\N	\N	Player	2024-04-12 14:07:51.123252	200	f
25	15	\N	\N	\N	Player	2024-04-12 14:07:51.123252	201	f
27	15	\N	\N	\N	Player	2024-04-12 14:07:51.123252	202	f
30	15	\N	\N	\N	Player	2024-04-12 14:07:51.123252	203	f
2	16	\N	\N	\N	Player	2024-04-12 14:07:51.123252	204	f
11	16	\N	\N	\N	Player	2024-04-12 14:07:51.123252	205	f
17	16	\N	\N	\N	Player	2024-04-12 14:07:51.123252	206	f
20	16	\N	\N	\N	Player	2024-04-12 14:07:51.123252	207	f
21	16	\N	\N	\N	Player	2024-04-12 14:07:51.123252	208	f
22	16	\N	\N	\N	Player	2024-04-12 14:07:51.123252	209	f
6	32	white	\N	\N	Player	2024-04-12 14:07:51.123252	210	f
8	32	\N	36	2024-04-10 19:25:45.695	Player	2024-04-12 14:07:51.123252	212	f
23	16	\N	\N	\N	Player	2024-04-12 14:07:51.123252	215	f
24	16	\N	\N	\N	Player	2024-04-12 14:07:51.123252	216	f
25	16	\N	\N	\N	Player	2024-04-12 14:07:51.123252	217	f
27	16	\N	\N	\N	Player	2024-04-12 14:07:51.123252	218	f
30	16	\N	\N	\N	Player	2024-04-12 14:07:51.123252	219	f
2	17	\N	\N	\N	Player	2024-04-12 14:07:51.123252	220	f
11	17	\N	\N	\N	Player	2024-04-12 14:07:51.123252	221	f
17	17	\N	\N	\N	Player	2024-04-12 14:07:51.123252	222	f
20	17	\N	\N	\N	Player	2024-04-12 14:07:51.123252	223	f
21	17	\N	\N	\N	Player	2024-04-12 14:07:51.123252	224	f
22	17	\N	\N	\N	Player	2024-04-12 14:07:51.123252	225	f
23	17	\N	\N	\N	Player	2024-04-12 14:07:51.123252	226	f
24	17	\N	\N	\N	Player	2024-04-12 14:07:51.123252	227	f
25	17	\N	\N	\N	Player	2024-04-12 14:07:51.123252	228	f
27	17	\N	\N	\N	Player	2024-04-12 14:07:51.123252	229	f
30	17	\N	\N	\N	Player	2024-04-12 14:07:51.123252	230	f
2	18	\N	\N	\N	Player	2024-04-12 14:07:51.123252	231	f
11	18	\N	\N	\N	Player	2024-04-12 14:07:51.123252	232	f
17	18	\N	\N	\N	Player	2024-04-12 14:07:51.123252	233	f
20	18	\N	\N	\N	Player	2024-04-12 14:07:51.123252	234	f
21	18	\N	\N	\N	Player	2024-04-12 14:07:51.123252	235	f
22	18	\N	\N	\N	Player	2024-04-12 14:07:51.123252	236	f
23	18	\N	\N	\N	Player	2024-04-12 14:07:51.123252	237	f
24	18	\N	\N	\N	Player	2024-04-12 14:07:51.123252	238	f
25	18	\N	\N	\N	Player	2024-04-12 14:07:51.123252	239	f
27	18	\N	\N	\N	Player	2024-04-12 14:07:51.123252	240	f
30	18	\N	\N	\N	Player	2024-04-12 14:07:51.123252	241	f
2	19	\N	\N	\N	Player	2024-04-12 14:07:51.123252	242	f
11	19	\N	\N	\N	Player	2024-04-12 14:07:51.123252	243	f
17	19	\N	\N	\N	Player	2024-04-12 14:07:51.123252	244	f
20	19	\N	\N	\N	Player	2024-04-12 14:07:51.123252	245	f
21	19	\N	\N	\N	Player	2024-04-12 14:07:51.123252	246	f
22	19	\N	\N	\N	Player	2024-04-12 14:07:51.123252	247	f
24	19	\N	\N	\N	Player	2024-04-12 14:07:51.123252	249	f
25	19	\N	\N	\N	Player	2024-04-12 14:07:51.123252	250	f
30	19	\N	\N	\N	Player	2024-04-12 14:07:51.123252	252	f
17	21	black	\N	\N	Player	2024-04-12 14:07:51.123252	255	f
22	21	\N	8	2024-04-14 17:13:14.704	Player	2024-04-12 14:07:51.123252	258	f
27	19	\N	\N	\N	Player	2024-04-12 14:07:51.123252	251	f
23	19	\N	\N	\N	Player	2024-04-12 14:07:51.123252	248	f
25	21	\N	23	2024-04-22 18:56:29.161	Player	2024-04-12 14:07:51.123252	261	f
25	22	\N	44	2024-04-29 03:14:07.905	Player	2024-04-12 14:07:51.123252	271	f
17	22	\N	51	2024-04-29 21:49:28.414	Player	2024-04-12 14:07:51.123252	265	f
22	22	black	\N	\N	Player	2024-04-12 14:07:51.123252	268	f
2	22	black	\N	\N	Player	2024-04-12 14:07:51.123252	263	f
21	22	black	\N	\N	Player	2024-04-12 14:07:51.123252	267	f
23	22	black	\N	\N	Player	2024-04-12 14:07:51.123252	269	f
20	22	black	\N	\N	Player	2024-04-12 14:07:51.123252	266	f
2	5	\N	\N	\N	Player	2024-04-12 14:07:51.123252	274	f
11	5	\N	\N	\N	Player	2024-04-12 14:07:51.123252	275	f
17	5	\N	\N	\N	Player	2024-04-12 14:07:51.123252	276	f
20	5	\N	\N	\N	Player	2024-04-12 14:07:51.123252	277	f
21	5	\N	\N	\N	Player	2024-04-12 14:07:51.123252	278	f
22	5	\N	\N	\N	Player	2024-04-12 14:07:51.123252	279	f
23	5	\N	\N	\N	Player	2024-04-12 14:07:51.123252	280	f
24	5	\N	\N	\N	Player	2024-04-12 14:07:51.123252	281	f
25	5	\N	\N	\N	Player	2024-04-12 14:07:51.123252	282	f
27	5	\N	\N	\N	Player	2024-04-12 14:07:51.123252	283	f
30	5	\N	\N	\N	Player	2024-04-12 14:07:51.123252	284	f
5	32	white	\N	\N	Player	2024-04-12 14:07:51.123252	285	f
3	32	white	\N	\N	Player	2024-04-12 14:07:51.123252	286	f
4	32	white	\N	\N	Player	2024-04-12 14:07:51.123252	287	f
19	32	white	\N	\N	Player	2024-04-12 14:07:51.123252	288	f
11	32	white	\N	\N	Player	2024-04-12 14:07:51.123252	289	f
35	5	\N	\N	\N	Goalie	2024-04-12 14:07:51.123252	290	f
32	5	\N	\N	\N	Goalie	2024-04-12 14:07:51.123252	291	f
35	6	\N	\N	\N	Goalie	2024-04-12 14:07:51.123252	292	f
32	6	\N	\N	\N	Goalie	2024-04-12 14:07:51.123252	293	f
35	7	\N	\N	\N	Goalie	2024-04-12 14:07:51.123252	294	f
16	32	\N	2	2024-04-10 02:33:38.152	Player	2024-04-12 14:07:51.123252	295	f
32	31	\N	\N	\N	Goalie	2024-04-12 14:07:51.123252	296	f
34	31	\N	\N	\N	Goalie	2024-04-12 14:07:51.123252	297	f
34	32	\N	\N	\N	Goalie	2024-04-12 14:07:51.123252	298	f
32	7	\N	\N	\N	Goalie	2024-04-12 14:07:51.123252	303	f
32	32	\N	33	2024-04-10 18:30:01.625	Goalie	2024-04-12 14:07:51.123252	304	f
33	32	\N	\N	\N	Goalie	2024-04-12 14:07:51.123252	305	f
9	32	\N	37	2024-04-10 20:36:00.776	Player	2024-04-12 14:07:51.123252	306	f
35	8	\N	\N	\N	Goalie	2024-04-12 14:07:51.123252	307	f
32	8	\N	\N	\N	Goalie	2024-04-12 14:07:51.123252	308	f
35	9	\N	\N	\N	Goalie	2024-04-12 14:07:51.123252	309	f
32	9	\N	\N	\N	Goalie	2024-04-12 14:07:51.123252	310	f
35	10	\N	\N	\N	Goalie	2024-04-12 14:07:51.123252	311	f
32	10	\N	\N	\N	Goalie	2024-04-12 14:07:51.123252	312	f
35	11	\N	\N	\N	Goalie	2024-04-12 14:07:51.123252	313	f
32	11	\N	\N	\N	Goalie	2024-04-12 14:07:51.123252	314	f
35	12	\N	\N	\N	Goalie	2024-04-12 14:07:51.123252	315	f
32	12	\N	\N	\N	Goalie	2024-04-12 14:07:51.123252	316	f
35	13	\N	\N	\N	Goalie	2024-04-12 14:07:51.123252	317	f
32	13	\N	\N	\N	Goalie	2024-04-12 14:07:51.123252	318	f
35	14	\N	\N	\N	Goalie	2024-04-12 14:07:51.123252	319	f
32	14	\N	\N	\N	Goalie	2024-04-12 14:07:51.123252	320	f
35	15	\N	\N	\N	Goalie	2024-04-12 14:07:51.123252	321	f
32	15	\N	\N	\N	Goalie	2024-04-12 14:07:51.123252	322	f
35	16	\N	\N	\N	Goalie	2024-04-12 14:07:51.123252	323	f
32	16	\N	\N	\N	Goalie	2024-04-12 14:07:51.123252	324	f
35	17	\N	\N	\N	Goalie	2024-04-12 14:07:51.123252	325	f
32	17	\N	\N	\N	Goalie	2024-04-12 14:07:51.123252	326	f
35	18	\N	\N	\N	Goalie	2024-04-12 14:07:51.123252	328	f
32	18	\N	\N	\N	Goalie	2024-04-12 14:07:51.123252	329	f
15	32	black	\N	\N	Player	2024-04-12 14:07:51.123252	341	f
1	32	black	\N	\N	Player	2024-04-12 14:07:51.123252	342	f
17	32	black	\N	\N	Player	2024-04-12 14:07:51.123252	343	f
36	32	black	\N	\N	Player	2024-04-12 14:07:51.123252	344	f
2	32	black	\N	\N	Player	2024-04-12 14:07:51.123252	345	f
7	32	black	\N	\N	Player	2024-04-12 14:07:51.123252	346	f
18	32	black	\N	\N	Player	2024-04-12 14:07:51.123252	347	f
37	32	white	\N	\N	Player	2024-04-12 14:07:51.123252	348	f
30	21	\N	39	2024-04-11 22:17:41.949	Player	2024-04-12 14:07:51.123252	360	f
17	20	black	\N	\N	Player	2024-04-12 14:07:51.123252	335	f
2	20	black	\N	\N	Player	2024-04-12 14:07:51.123252	356	f
21	20	black	\N	\N	Player	2024-04-12 14:07:51.123252	357	f
23	20	black	\N	\N	Player	2024-04-12 14:07:51.123252	338	f
27	20	black	\N	\N	Player	2024-04-12 14:07:51.123252	333	f
30	20	black	38	2024-04-12 16:49:07.623	Player	2024-04-12 14:07:51.123252	340	f
22	20	white	\N	\N	Player	2024-04-12 14:07:51.123252	355	f
24	20	white	\N	\N	Player	2024-04-12 14:07:51.123252	337	f
20	20	white	\N	\N	Player	2024-04-12 14:07:51.123252	339	f
32	19	\N	\N	2024-04-15 15:10:39.505	Goalie	2024-04-12 14:07:51.123252	331	f
35	19	\N	\N	\N	Goalie	2024-04-12 14:07:51.123252	330	f
11	20	white	40	2024-04-15 17:30:12.86	Player	2024-04-12 14:07:51.123252	327	f
30	22	black	\N	\N	Player	2024-04-12 14:07:51.123252	273	f
32	20	white	\N	\N	Goalie	2024-04-12 14:07:51.123252	334	f
27	22	black	\N	\N	Player	2024-04-12 14:07:51.123252	272	f
39	21	black	\N	\N	Player	2024-04-12 14:07:51.123252	361	f
35	21	black	\N	\N	Goalie	2024-04-12 14:07:51.123252	332	f
32	33	black	\N	\N	Goalie	2024-04-12 14:07:51.123252	299	f
34	33	white	\N	\N	Goalie	2024-04-12 14:07:51.123252	300	f
32	21	white	\N	\N	Goalie	2024-04-12 14:07:51.123252	349	f
25	20	black	39	2024-04-15 14:36:28.706	Player	2024-04-12 14:07:51.123252	336	f
32	22	black	\N	\N	Goalie	2024-04-12 14:07:51.123252	351	f
35	22	white	\N	\N	Goalie	2024-04-12 14:07:51.123252	350	f
34	34	black	\N	\N	Goalie	2024-04-12 14:07:51.123252	302	f
32	34	white	\N	\N	Goalie	2024-04-12 14:07:51.123252	301	f
7	34	white	\N	\N	Player	2024-04-12 14:07:51.123252	37	f
2	21	black	\N	\N	Player	2024-04-12 14:07:51.123252	253	f
23	21	black	41	2024-04-19 15:52:43.715	Player	2024-04-12 14:07:51.123252	259	f
23	21	black	\N	\N	Player	2024-04-22 21:31:38.712897	396	f
27	21	black	\N	\N	Player	2024-04-12 14:07:51.123252	262	f
42	21	white	\N	\N	Player	2024-04-19 16:13:53.217763	393	f
3	21	white	\N	\N	Player	2024-04-22 19:56:52.497329	395	f
12	21	white	\N	\N	Player	2024-04-19 15:16:46.143255	392	f
24	21	white	\N	\N	Player	2024-04-12 14:07:51.123252	260	f
21	21	white	\N	\N	Player	2024-04-12 14:07:51.123252	257	f
1	33	\N	2	2024-04-16 16:36:22.883	Player	2024-04-12 14:07:51.123252	17	f
3	33	white	\N	\N	Player	2024-04-12 14:07:51.123252	19	f
4	33	white	\N	\N	Player	2024-04-12 14:07:51.123252	20	f
5	33	black	\N	\N	Player	2024-04-12 14:07:51.123252	21	f
7	33	white	\N	\N	Player	2024-04-12 14:07:51.123252	22	f
8	33	black	\N	\N	Player	2024-04-12 14:07:51.123252	23	f
11	33	black	\N	\N	Player	2024-04-12 14:07:51.123252	24	f
15	33	black	\N	\N	Player	2024-04-12 14:07:51.123252	25	f
16	33	\N	41	2024-04-17 14:17:31.236	Player	2024-04-12 14:07:51.123252	26	f
18	33	black	\N	\N	Player	2024-04-12 14:07:51.123252	27	f
31	20	black	\N	\N	Player	2024-04-12 14:07:51.123252	211	f
39	20	black	\N	\N	Player	2024-04-12 16:49:18.617033	374	t
35	20	black	\N	\N	Goalie	2024-04-12 18:07:03.41808	378	f
1	20	white	\N	\N	Player	2024-04-12 14:07:51.123252	213	f
40	20	white	\N	\N	Player	2024-04-15 14:51:50.132323	381	f
38	20	white	\N	\N	Player	2024-04-12 16:49:05.995893	373	t
26	20	white	\N	\N	Player	2024-04-12 14:07:51.123252	214	f
34	19	\N	\N	\N	Goalie	2024-04-15 15:09:45.243661	384	f
35	19	\N	\N	2024-04-15 15:10:30.998	Goalie	2024-04-15 15:09:59.123751	385	f
8	20	\N	\N	\N	Player	2024-04-15 16:54:11.515011	386	t
19	33	\N	1	2024-04-17 14:13:58.459	Player	2024-04-12 14:07:51.123252	28	f
9	33	\N	22	2024-04-17 14:31:41.628	Player	2024-04-12 14:07:51.123252	29	f
6	33	black	\N	\N	Player	2024-04-12 14:07:51.123252	30	f
2	33	white	\N	\N	Player	2024-04-16 16:36:13.392602	387	t
1	33	white	\N	\N	Player	2024-04-16 16:36:33.045194	388	t
22	33	white	\N	\N	Player	2024-04-17 20:46:20.232152	390	t
41	33	white	\N	\N	Player	2024-04-17 20:48:36.218329	391	t
20	21	white	\N	\N	Player	2024-04-12 14:07:51.123252	256	f
8	21	\N	12	2024-04-19 14:31:24.154	Player	2024-04-14 17:13:22.454786	380	f
11	21	white	\N	\N	Player	2024-04-12 14:07:51.123252	254	f
41	21	\N	3	2024-04-22 18:56:16.29	Player	2024-04-19 16:58:01.421131	394	f
43	34	black	2	2024-04-24 21:00:35.977	Player	2024-04-24 16:03:56.191066	397	f
24	35	\N	51	2024-05-06 03:00:56.531	Player	2024-04-27 18:35:56.974334	412	f
1	35	black	\N	\N	Player	2024-04-27 18:35:56.974334	405	f
21	35	\N	38	2024-05-06 03:00:48.772	Player	2024-04-27 18:35:56.974334	409	f
27	35	\N	4	2024-05-06 14:32:13.404	Player	2024-04-27 18:35:56.974334	415	f
30	35	black	\N	\N	Player	2024-04-27 18:35:56.974334	417	f
31	35	black	\N	\N	Player	2024-04-27 18:35:56.974334	416	f
23	35	black	\N	\N	Player	2024-04-27 18:35:56.974334	411	f
16	34	black	\N	2024-04-24 21:02:25.65	Player	2024-04-12 14:07:51.123252	41	f
45	34	black	\N	\N	Player	2024-04-24 20:55:06.414444	400	f
2	34	black	\N	\N	Player	2024-04-24 21:00:48.046418	403	f
44	34	black	\N	\N	Player	2024-04-24 20:55:01.794822	399	f
11	34	black	\N	\N	Player	2024-04-12 14:07:51.123252	39	f
48	34	white	\N	\N	Player	2024-04-24 20:55:25.210682	402	f
37	34	white	\N	\N	Player	2024-04-24 20:55:21.703406	401	f
11	38	\N	\N	\N	Player	2024-04-27 18:35:56.974334	446	f
1	38	\N	\N	\N	Player	2024-04-27 18:35:56.974334	447	f
2	38	\N	\N	\N	Player	2024-04-27 18:35:56.974334	448	f
17	38	\N	\N	\N	Player	2024-04-27 18:35:56.974334	449	f
20	38	\N	\N	\N	Player	2024-04-27 18:35:56.974334	450	f
21	38	\N	\N	\N	Player	2024-04-27 18:35:56.974334	451	f
22	38	\N	\N	\N	Player	2024-04-27 18:35:56.974334	452	f
23	38	\N	\N	\N	Player	2024-04-27 18:35:56.974334	453	f
24	38	\N	\N	\N	Player	2024-04-27 18:35:56.974334	454	f
26	38	\N	\N	\N	Player	2024-04-27 18:35:56.974334	456	f
11	35	black	\N	\N	Player	2024-04-27 18:35:56.974334	404	f
22	35	white	\N	\N	Player	2024-04-27 18:35:56.974334	410	f
17	36	black	\N	\N	Player	2024-04-27 18:35:56.974334	421	f
25	38	\N	\N	2024-05-07 11:55:54.255	Player	2024-04-27 18:35:56.974334	455	f
25	36	\N	51	2024-05-07 11:55:39.518	Player	2024-04-27 18:35:56.974334	427	f
2	36	black	\N	\N	Player	2024-04-27 18:35:56.974334	420	f
26	36	\N	12	2024-05-07 18:18:47.656	Player	2024-04-27 18:35:56.974334	428	f
30	36	\N	53	2024-05-12 13:26:38.682	Player	2024-04-27 18:35:56.974334	431	f
21	36	\N	43	2024-05-13 20:57:46.484	Player	2024-04-27 18:35:56.974334	423	f
20	36	black	\N	\N	Player	2024-04-27 18:35:56.974334	422	f
11	36	\N	4	2024-05-13 20:58:15.54	Player	2024-04-27 18:35:56.974334	418	f
27	36	black	\N	\N	Player	2024-04-27 18:35:56.974334	429	f
22	36	white	\N	\N	Player	2024-04-27 18:35:56.974334	424	f
1	36	white	\N	\N	Player	2024-04-27 18:35:56.974334	419	f
31	36	white	\N	\N	Player	2024-04-27 18:35:56.974334	430	f
23	36	white	\N	\N	Player	2024-04-27 18:35:56.974334	425	f
24	36	white	\N	\N	Player	2024-04-27 18:35:56.974334	426	f
27	38	\N	\N	\N	Player	2024-04-27 18:35:56.974334	457	f
31	38	\N	\N	\N	Player	2024-04-27 18:35:56.974334	458	f
30	38	\N	\N	\N	Player	2024-04-27 18:35:56.974334	459	f
11	39	\N	\N	\N	Player	2024-04-27 18:35:56.974334	460	f
1	39	\N	\N	\N	Player	2024-04-27 18:35:56.974334	461	f
2	39	\N	\N	\N	Player	2024-04-27 18:35:56.974334	462	f
17	39	\N	\N	\N	Player	2024-04-27 18:35:56.974334	463	f
20	39	\N	\N	\N	Player	2024-04-27 18:35:56.974334	464	f
21	39	\N	\N	\N	Player	2024-04-27 18:35:56.974334	465	f
22	39	\N	\N	\N	Player	2024-04-27 18:35:56.974334	466	f
23	39	\N	\N	\N	Player	2024-04-27 18:35:56.974334	467	f
24	39	\N	\N	\N	Player	2024-04-27 18:35:56.974334	468	f
25	39	\N	\N	\N	Player	2024-04-27 18:35:56.974334	469	f
26	39	\N	\N	\N	Player	2024-04-27 18:35:56.974334	470	f
27	39	\N	\N	\N	Player	2024-04-27 18:35:56.974334	471	f
31	39	\N	\N	\N	Player	2024-04-27 18:35:56.974334	472	f
30	39	\N	\N	\N	Player	2024-04-27 18:35:56.974334	473	f
11	40	\N	\N	\N	Player	2024-04-27 18:35:56.974334	474	f
1	40	\N	\N	\N	Player	2024-04-27 18:35:56.974334	475	f
2	40	\N	\N	\N	Player	2024-04-27 18:35:56.974334	476	f
17	40	\N	\N	\N	Player	2024-04-27 18:35:56.974334	477	f
20	40	\N	\N	\N	Player	2024-04-27 18:35:56.974334	478	f
21	40	\N	\N	\N	Player	2024-04-27 18:35:56.974334	479	f
22	40	\N	\N	\N	Player	2024-04-27 18:35:56.974334	480	f
23	40	\N	\N	\N	Player	2024-04-27 18:35:56.974334	481	f
24	40	\N	\N	\N	Player	2024-04-27 18:35:56.974334	482	f
25	40	\N	\N	\N	Player	2024-04-27 18:35:56.974334	483	f
26	40	\N	\N	\N	Player	2024-04-27 18:35:56.974334	484	f
27	40	\N	\N	\N	Player	2024-04-27 18:35:56.974334	485	f
31	40	\N	\N	\N	Player	2024-04-27 18:35:56.974334	486	f
30	40	\N	\N	\N	Player	2024-04-27 18:35:56.974334	487	f
11	41	\N	\N	\N	Player	2024-04-27 18:35:56.974334	488	f
1	41	\N	\N	\N	Player	2024-04-27 18:35:56.974334	489	f
2	41	\N	\N	\N	Player	2024-04-27 18:35:56.974334	490	f
17	41	\N	\N	\N	Player	2024-04-27 18:35:56.974334	491	f
20	41	\N	\N	\N	Player	2024-04-27 18:35:56.974334	492	f
21	41	\N	\N	\N	Player	2024-04-27 18:35:56.974334	493	f
22	41	\N	\N	\N	Player	2024-04-27 18:35:56.974334	494	f
23	41	\N	\N	\N	Player	2024-04-27 18:35:56.974334	495	f
24	41	\N	\N	\N	Player	2024-04-27 18:35:56.974334	496	f
25	41	\N	\N	\N	Player	2024-04-27 18:35:56.974334	497	f
26	41	\N	\N	\N	Player	2024-04-27 18:35:56.974334	498	f
27	41	\N	\N	\N	Player	2024-04-27 18:35:56.974334	499	f
31	41	\N	\N	\N	Player	2024-04-27 18:35:56.974334	500	f
30	41	\N	\N	\N	Player	2024-04-27 18:35:56.974334	501	f
11	42	\N	\N	\N	Player	2024-04-27 18:35:56.974334	502	f
1	42	\N	\N	\N	Player	2024-04-27 18:35:56.974334	503	f
2	42	\N	\N	\N	Player	2024-04-27 18:35:56.974334	504	f
17	42	\N	\N	\N	Player	2024-04-27 18:35:56.974334	505	f
20	42	\N	\N	\N	Player	2024-04-27 18:35:56.974334	506	f
21	42	\N	\N	\N	Player	2024-04-27 18:35:56.974334	507	f
22	42	\N	\N	\N	Player	2024-04-27 18:35:56.974334	508	f
23	42	\N	\N	\N	Player	2024-04-27 18:35:56.974334	509	f
24	42	\N	\N	\N	Player	2024-04-27 18:35:56.974334	510	f
25	42	\N	\N	\N	Player	2024-04-27 18:35:56.974334	511	f
26	42	\N	\N	\N	Player	2024-04-27 18:35:56.974334	512	f
27	42	\N	\N	\N	Player	2024-04-27 18:35:56.974334	513	f
31	42	\N	\N	\N	Player	2024-04-27 18:35:56.974334	514	f
30	42	\N	\N	\N	Player	2024-04-27 18:35:56.974334	515	f
11	44	\N	\N	\N	Player	2024-04-27 18:35:56.974334	530	f
1	44	\N	\N	\N	Player	2024-04-27 18:35:56.974334	531	f
2	44	\N	\N	\N	Player	2024-04-27 18:35:56.974334	532	f
17	44	\N	\N	\N	Player	2024-04-27 18:35:56.974334	533	f
20	44	\N	\N	\N	Player	2024-04-27 18:35:56.974334	534	f
21	44	\N	\N	\N	Player	2024-04-27 18:35:56.974334	535	f
22	44	\N	\N	\N	Player	2024-04-27 18:35:56.974334	536	f
23	44	\N	\N	\N	Player	2024-04-27 18:35:56.974334	537	f
24	44	\N	\N	\N	Player	2024-04-27 18:35:56.974334	538	f
25	44	\N	\N	\N	Player	2024-04-27 18:35:56.974334	539	f
26	44	\N	\N	\N	Player	2024-04-27 18:35:56.974334	540	f
27	44	\N	\N	\N	Player	2024-04-27 18:35:56.974334	541	f
31	44	\N	\N	\N	Player	2024-04-27 18:35:56.974334	542	f
30	44	\N	\N	\N	Player	2024-04-27 18:35:56.974334	543	f
11	45	\N	\N	\N	Player	2024-04-27 18:35:56.974334	544	f
1	45	\N	\N	\N	Player	2024-04-27 18:35:56.974334	545	f
2	45	\N	\N	\N	Player	2024-04-27 18:35:56.974334	546	f
17	45	\N	\N	\N	Player	2024-04-27 18:35:56.974334	547	f
20	45	\N	\N	\N	Player	2024-04-27 18:35:56.974334	548	f
21	45	\N	\N	\N	Player	2024-04-27 18:35:56.974334	549	f
22	45	\N	\N	\N	Player	2024-04-27 18:35:56.974334	550	f
23	45	\N	\N	\N	Player	2024-04-27 18:35:56.974334	551	f
24	45	\N	\N	\N	Player	2024-04-27 18:35:56.974334	552	f
25	45	\N	\N	\N	Player	2024-04-27 18:35:56.974334	553	f
26	45	\N	\N	\N	Player	2024-04-27 18:35:56.974334	554	f
27	45	\N	\N	\N	Player	2024-04-27 18:35:56.974334	555	f
31	45	\N	\N	\N	Player	2024-04-27 18:35:56.974334	556	f
30	45	\N	\N	\N	Player	2024-04-27 18:35:56.974334	557	f
11	46	\N	\N	\N	Player	2024-04-27 18:35:56.974334	558	f
1	46	\N	\N	\N	Player	2024-04-27 18:35:56.974334	559	f
2	46	\N	\N	\N	Player	2024-04-27 18:35:56.974334	560	f
17	46	\N	\N	\N	Player	2024-04-27 18:35:56.974334	561	f
20	46	\N	\N	\N	Player	2024-04-27 18:35:56.974334	562	f
21	46	\N	\N	\N	Player	2024-04-27 18:35:56.974334	563	f
22	46	\N	\N	\N	Player	2024-04-27 18:35:56.974334	564	f
23	46	\N	\N	\N	Player	2024-04-27 18:35:56.974334	565	f
24	46	\N	\N	\N	Player	2024-04-27 18:35:56.974334	566	f
25	46	\N	\N	\N	Player	2024-04-27 18:35:56.974334	567	f
26	46	\N	\N	\N	Player	2024-04-27 18:35:56.974334	568	f
27	46	\N	\N	\N	Player	2024-04-27 18:35:56.974334	569	f
31	46	\N	\N	\N	Player	2024-04-27 18:35:56.974334	570	f
30	46	\N	\N	\N	Player	2024-04-27 18:35:56.974334	571	f
11	47	\N	\N	\N	Player	2024-04-27 18:35:56.974334	572	f
1	47	\N	\N	\N	Player	2024-04-27 18:35:56.974334	573	f
2	47	\N	\N	\N	Player	2024-04-27 18:35:56.974334	574	f
17	47	\N	\N	\N	Player	2024-04-27 18:35:56.974334	575	f
20	47	\N	\N	\N	Player	2024-04-27 18:35:56.974334	576	f
21	47	\N	\N	\N	Player	2024-04-27 18:35:56.974334	577	f
22	47	\N	\N	\N	Player	2024-04-27 18:35:56.974334	578	f
23	47	\N	\N	\N	Player	2024-04-27 18:35:56.974334	579	f
24	47	\N	\N	\N	Player	2024-04-27 18:35:56.974334	580	f
25	47	\N	\N	\N	Player	2024-04-27 18:35:56.974334	581	f
26	47	\N	\N	\N	Player	2024-04-27 18:35:56.974334	582	f
27	47	\N	\N	\N	Player	2024-04-27 18:35:56.974334	583	f
31	47	\N	\N	\N	Player	2024-04-27 18:35:56.974334	584	f
30	47	\N	\N	\N	Player	2024-04-27 18:35:56.974334	585	f
11	49	\N	\N	\N	Player	2024-04-27 18:35:56.974334	600	f
1	49	\N	\N	\N	Player	2024-04-27 18:35:56.974334	601	f
2	49	\N	\N	\N	Player	2024-04-27 18:35:56.974334	602	f
17	49	\N	\N	\N	Player	2024-04-27 18:35:56.974334	603	f
20	49	\N	\N	\N	Player	2024-04-27 18:35:56.974334	604	f
21	49	\N	\N	\N	Player	2024-04-27 18:35:56.974334	605	f
22	49	\N	\N	\N	Player	2024-04-27 18:35:56.974334	606	f
23	49	\N	\N	\N	Player	2024-04-27 18:35:56.974334	607	f
24	49	\N	\N	\N	Player	2024-04-27 18:35:56.974334	608	f
25	49	\N	\N	\N	Player	2024-04-27 18:35:56.974334	609	f
26	49	\N	\N	\N	Player	2024-04-27 18:35:56.974334	610	f
27	49	\N	\N	\N	Player	2024-04-27 18:35:56.974334	611	f
31	49	\N	\N	\N	Player	2024-04-27 18:35:56.974334	612	f
30	49	\N	\N	\N	Player	2024-04-27 18:35:56.974334	613	f
11	50	\N	\N	\N	Player	2024-04-27 18:35:56.974334	614	f
1	50	\N	\N	\N	Player	2024-04-27 18:35:56.974334	615	f
2	50	\N	\N	\N	Player	2024-04-27 18:35:56.974334	616	f
17	50	\N	\N	\N	Player	2024-04-27 18:35:56.974334	617	f
20	50	\N	\N	\N	Player	2024-04-27 18:35:56.974334	618	f
21	50	\N	\N	\N	Player	2024-04-27 18:35:56.974334	619	f
22	50	\N	\N	\N	Player	2024-04-27 18:35:56.974334	620	f
23	50	\N	\N	\N	Player	2024-04-27 18:35:56.974334	621	f
24	50	\N	\N	\N	Player	2024-04-27 18:35:56.974334	622	f
25	50	\N	\N	\N	Player	2024-04-27 18:35:56.974334	623	f
26	50	\N	\N	\N	Player	2024-04-27 18:35:56.974334	624	f
27	50	\N	\N	\N	Player	2024-04-27 18:35:56.974334	625	f
31	50	\N	\N	\N	Player	2024-04-27 18:35:56.974334	626	f
30	50	\N	\N	\N	Player	2024-04-27 18:35:56.974334	627	f
11	51	\N	\N	\N	Player	2024-04-27 18:35:56.974334	628	f
1	51	\N	\N	\N	Player	2024-04-27 18:35:56.974334	629	f
2	51	\N	\N	\N	Player	2024-04-27 18:35:56.974334	630	f
17	51	\N	\N	\N	Player	2024-04-27 18:35:56.974334	631	f
20	51	\N	\N	\N	Player	2024-04-27 18:35:56.974334	632	f
21	51	\N	\N	\N	Player	2024-04-27 18:35:56.974334	633	f
22	51	\N	\N	\N	Player	2024-04-27 18:35:56.974334	634	f
23	51	\N	\N	\N	Player	2024-04-27 18:35:56.974334	635	f
24	51	\N	\N	\N	Player	2024-04-27 18:35:56.974334	636	f
25	51	\N	\N	\N	Player	2024-04-27 18:35:56.974334	637	f
26	51	\N	\N	\N	Player	2024-04-27 18:35:56.974334	638	f
27	51	\N	\N	\N	Player	2024-04-27 18:35:56.974334	639	f
31	51	\N	\N	\N	Player	2024-04-27 18:35:56.974334	640	f
30	51	\N	\N	\N	Player	2024-04-27 18:35:56.974334	641	f
35	38	\N	\N	\N	Goalie	2024-04-27 18:36:16.594989	648	f
32	38	\N	\N	\N	Goalie	2024-04-27 18:36:16.594989	649	f
35	39	\N	\N	\N	Goalie	2024-04-27 18:36:16.594989	650	f
32	39	\N	\N	\N	Goalie	2024-04-27 18:36:16.594989	651	f
35	40	\N	\N	\N	Goalie	2024-04-27 18:36:16.594989	652	f
32	40	\N	\N	\N	Goalie	2024-04-27 18:36:16.594989	653	f
35	41	\N	\N	\N	Goalie	2024-04-27 18:36:16.594989	654	f
32	41	\N	\N	\N	Goalie	2024-04-27 18:36:16.594989	655	f
35	42	\N	\N	\N	Goalie	2024-04-27 18:36:16.594989	656	f
32	42	\N	\N	\N	Goalie	2024-04-27 18:36:16.594989	657	f
35	44	\N	\N	\N	Goalie	2024-04-27 18:36:16.594989	660	f
32	44	\N	\N	\N	Goalie	2024-04-27 18:36:16.594989	661	f
35	45	\N	\N	\N	Goalie	2024-04-27 18:36:16.594989	662	f
32	45	\N	\N	\N	Goalie	2024-04-27 18:36:16.594989	663	f
35	46	\N	\N	\N	Goalie	2024-04-27 18:36:16.594989	664	f
32	46	\N	\N	\N	Goalie	2024-04-27 18:36:16.594989	665	f
35	47	\N	\N	\N	Goalie	2024-04-27 18:36:16.594989	666	f
32	47	\N	\N	\N	Goalie	2024-04-27 18:36:16.594989	667	f
35	49	\N	\N	\N	Goalie	2024-04-27 18:36:16.594989	670	f
32	49	\N	\N	\N	Goalie	2024-04-27 18:36:16.594989	671	f
35	50	\N	\N	\N	Goalie	2024-04-27 18:36:16.594989	672	f
32	50	\N	\N	\N	Goalie	2024-04-27 18:36:16.594989	673	f
35	51	\N	\N	\N	Goalie	2024-04-27 18:36:16.594989	674	f
32	51	\N	\N	\N	Goalie	2024-04-27 18:36:16.594989	675	f
32	35	black	\N	\N	Goalie	2024-04-27 18:36:16.594989	643	f
35	35	white	\N	\N	Goalie	2024-04-27 18:36:16.594989	642	f
11	54	black	\N	\N	Player	2024-04-27 20:14:15.962606	695	f
1	53	white	\N	\N	Player	2024-04-27 20:14:15.962606	688	f
2	53	white	\N	\N	Player	2024-04-27 20:14:15.962606	689	f
7	53	white	\N	\N	Player	2024-04-27 20:14:15.962606	686	f
11	53	white	\N	\N	Player	2024-04-27 20:14:15.962606	687	f
3	54	black	\N	\N	Player	2024-04-27 20:14:15.962606	692	f
4	54	black	\N	\N	Player	2024-04-27 20:14:15.962606	693	f
1	54	white	\N	\N	Player	2024-04-27 20:14:15.962606	696	f
15	53	black	\N	\N	Player	2024-04-27 20:14:15.962606	690	f
18	53	black	\N	\N	Player	2024-04-27 20:14:15.962606	691	f
4	53	black	\N	\N	Player	2024-04-27 20:14:15.962606	685	f
3	53	white	\N	\N	Player	2024-04-27 20:14:15.962606	684	f
35	36	black	\N	\N	Goalie	2024-04-27 18:36:16.594989	644	f
32	36	white	\N	\N	Goalie	2024-04-27 18:36:16.594989	645	f
7	54	white	\N	\N	Player	2024-04-27 20:14:15.962606	694	f
3	55	\N	\N	\N	Player	2024-04-27 20:14:15.962606	700	f
4	55	\N	\N	\N	Player	2024-04-27 20:14:15.962606	701	f
7	55	\N	\N	\N	Player	2024-04-27 20:14:15.962606	702	f
11	55	\N	\N	\N	Player	2024-04-27 20:14:15.962606	703	f
1	55	\N	\N	\N	Player	2024-04-27 20:14:15.962606	704	f
2	55	\N	\N	\N	Player	2024-04-27 20:14:15.962606	705	f
15	55	\N	\N	\N	Player	2024-04-27 20:14:15.962606	706	f
18	55	\N	\N	\N	Player	2024-04-27 20:14:15.962606	707	f
3	56	\N	\N	\N	Player	2024-04-27 20:14:15.962606	708	f
4	56	\N	\N	\N	Player	2024-04-27 20:14:15.962606	709	f
7	56	\N	\N	\N	Player	2024-04-27 20:14:15.962606	710	f
11	56	\N	\N	\N	Player	2024-04-27 20:14:15.962606	711	f
1	56	\N	\N	\N	Player	2024-04-27 20:14:15.962606	712	f
2	56	\N	\N	\N	Player	2024-04-27 20:14:15.962606	713	f
15	56	\N	\N	\N	Player	2024-04-27 20:14:15.962606	714	f
18	56	\N	\N	\N	Player	2024-04-27 20:14:15.962606	715	f
32	55	\N	\N	\N	Goalie	2024-04-27 20:14:36.086974	722	f
34	55	\N	\N	\N	Goalie	2024-04-27 20:14:36.086974	723	f
32	56	\N	\N	\N	Goalie	2024-04-27 20:14:36.086974	724	f
34	56	\N	\N	\N	Goalie	2024-04-27 20:14:36.086974	725	f
17	55	\N	\N	\N	Player	2024-04-27 20:15:03.109364	729	f
17	56	\N	\N	\N	Player	2024-04-27 20:15:03.109364	730	f
6	55	\N	\N	\N	Player	2024-04-27 21:21:05.402923	734	f
6	56	\N	\N	\N	Player	2024-04-27 21:21:05.402923	735	f
5	55	\N	\N	\N	Player	2024-04-28 14:18:03.33381	739	f
5	56	\N	\N	\N	Player	2024-04-28 14:18:03.33381	740	f
43	55	\N	\N	\N	Player	2024-04-28 23:48:55.567729	744	f
43	56	\N	\N	\N	Player	2024-04-28 23:48:55.567729	745	f
50	55	\N	\N	\N	Player	2024-04-29 16:56:27.906517	750	f
50	56	\N	\N	\N	Player	2024-04-29 16:56:27.906517	751	f
44	52	black	\N	\N	Player	2024-05-01 23:09:37.434456	754	f
15	52	black	\N	\N	Player	2024-04-27 20:14:15.962606	682	f
18	52	black	\N	\N	Player	2024-04-27 20:14:15.962606	683	f
5	52	black	\N	\N	Player	2024-04-28 14:18:03.33381	736	f
51	22	white	\N	\N	Player	2024-04-29 21:50:28.415364	752	f
44	22	white	\N	\N	Player	2024-04-29 03:16:56.528468	746	f
24	22	white	\N	\N	Player	2024-04-12 14:07:51.123252	270	f
11	22	white	\N	\N	Player	2024-04-12 14:07:51.123252	264	f
3	52	black	\N	\N	Player	2024-04-27 20:14:15.962606	676	f
17	52	\N	44	2024-05-01 23:09:28.241	Player	2024-04-27 20:15:03.109364	726	f
2	52	black	\N	\N	Player	2024-04-27 20:14:15.962606	681	f
34	52	\N	41	2024-05-01 23:09:45.233	Goalie	2024-04-27 20:14:36.086974	717	f
11	52	black	\N	\N	Player	2024-04-27 20:14:15.962606	679	f
32	52	black	\N	\N	Goalie	2024-04-27 20:14:36.086974	716	f
36	52	white	\N	\N	Player	2024-05-01 23:09:22.854083	753	f
6	52	white	\N	\N	Player	2024-04-27 21:21:05.402923	731	f
43	52	white	\N	\N	Player	2024-04-28 23:48:55.567729	741	f
1	52	white	\N	\N	Player	2024-04-27 20:14:15.962606	680	f
4	52	white	\N	\N	Player	2024-04-27 20:14:15.962606	677	f
50	52	white	\N	\N	Player	2024-04-29 16:56:27.906517	747	f
7	52	white	\N	\N	Player	2024-04-27 20:14:15.962606	678	f
41	52	white	\N	\N	Goalie	2024-05-01 23:09:52.456637	755	f
32	53	\N	52	2024-05-08 13:29:29.066	Goalie	2024-04-27 20:14:36.086974	718	f
6	53	\N	37	2024-05-08 13:29:22.888	Player	2024-04-27 21:21:05.402923	732	f
4	35	black	\N	\N	Player	2024-05-06 16:34:32.423509	758	f
38	35	black	\N	\N	Player	2024-05-06 03:01:13.728673	756	f
17	35	white	\N	\N	Player	2024-04-27 18:35:56.974334	407	f
25	35	white	\N	\N	Player	2024-04-27 18:35:56.974334	413	f
2	35	white	\N	\N	Player	2024-04-27 18:35:56.974334	406	f
17	53	black	\N	\N	Player	2024-04-27 20:15:03.109364	727	f
41	53	\N	48	2024-05-09 00:35:35.563	Player	2024-05-08 13:29:18.116589	761	f
48	53	black	\N	\N	Player	2024-05-09 00:35:41.319148	764	f
51	35	white	\N	\N	Player	2024-05-06 11:57:12.990655	757	f
26	35	white	\N	\N	Player	2024-04-27 18:35:56.974334	414	f
20	35	white	\N	\N	Player	2024-04-27 18:35:56.974334	408	f
37	53	black	\N	\N	Player	2024-05-08 13:31:26.686182	763	f
50	53	black	\N	\N	Player	2024-04-29 16:56:27.906517	748	f
34	53	black	\N	\N	Goalie	2024-04-27 20:14:36.086974	719	f
43	53	white	\N	\N	Player	2024-04-28 23:48:55.567729	742	f
5	53	white	\N	\N	Player	2024-04-28 14:18:03.33381	737	f
52	53	white	\N	\N	Goalie	2024-05-08 13:30:43.981662	762	f
51	36	white	\N	\N	Player	2024-05-07 18:11:12.714225	759	f
6	54	\N	\N	2024-05-09 15:20:41.387	Player	2024-04-27 21:21:05.402923	733	f
53	36	white	\N	\N	Player	2024-05-12 13:26:13.004131	765	f
34	54	\N	54	2024-05-14 15:08:53.953	Goalie	2024-04-27 20:14:36.086974	721	f
50	54	\N	\N	2024-05-16 00:25:18.971	Player	2024-04-29 16:56:27.906517	749	f
43	54	black	\N	\N	Player	2024-04-28 23:48:55.567729	743	f
12	36	black	\N	\N	Player	2024-05-07 18:18:59.263254	760	f
43	36	black	\N	\N	Player	2024-05-12 13:26:28.094102	766	f
4	36	black	\N	\N	Player	2024-05-13 20:58:28.082728	767	f
15	54	black	\N	\N	Player	2024-04-27 20:14:15.962606	698	f
55	54	black	\N	\N	Player	2024-05-16 00:26:05.878615	769	f
54	54	black	\N	\N	Goalie	2024-05-16 00:25:09.913793	768	f
18	54	white	\N	\N	Player	2024-04-27 20:14:15.962606	699	f
5	54	white	\N	\N	Player	2024-04-28 14:18:03.33381	738	f
17	54	white	\N	\N	Player	2024-04-27 20:15:03.109364	728	f
2	54	white	\N	\N	Player	2024-04-27 20:14:15.962606	697	f
32	54	white	\N	\N	Goalie	2024-04-27 20:14:36.086974	720	f
\.


--
-- Data for Name: skates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.skates (id, scheduled_on, booking_id, slug) FROM stdin;
33	2024-04-18 01:30:00	13	apr17-930
34	2024-04-25 01:30:00	13	apr24-930
5	2024-01-02 01:45:00	14	jan1-845
6	2024-01-09 01:45:00	14	jan8-845
7	2024-01-16 01:45:00	14	jan15-845
8	2024-01-23 01:45:00	14	jan22-845
9	2024-01-30 01:45:00	14	jan29-845
10	2024-02-06 01:45:00	14	feb5-845
11	2024-02-13 01:45:00	14	feb12-845
12	2024-02-20 01:45:00	14	feb19-845
13	2024-02-27 01:45:00	14	feb26-845
14	2024-03-05 01:45:00	14	mar4-845
15	2024-03-12 00:45:00	14	mar11-845
16	2024-03-19 00:45:00	14	mar18-845
17	2024-03-26 00:45:00	14	mar25-845
18	2024-04-02 00:45:00	14	apr1-845
19	2024-04-09 00:45:00	14	apr8-845
20	2024-04-16 00:45:00	14	apr15-845
21	2024-04-23 00:45:00	14	apr22-845
22	2024-04-30 00:45:00	14	apr29-845
52	2024-05-02 01:30:00	16	may1-930
53	2024-05-09 01:30:00	16	may8-930
35	2024-05-07 00:45:00	15	may6-845
36	2024-05-14 00:45:00	15	may13-845
38	2024-05-28 00:45:00	15	may27-845
39	2024-06-04 00:45:00	15	jun3-845
40	2024-06-11 00:45:00	15	jun10-845
41	2024-06-18 00:45:00	15	jun17-845
42	2024-06-25 00:45:00	15	jun24-845
44	2024-07-09 00:45:00	15	jul8-845
45	2024-07-16 00:45:00	15	jul15-845
46	2024-07-23 00:45:00	15	jul22-845
47	2024-07-30 00:45:00	15	jul29-845
49	2024-08-13 00:45:00	15	aug12-845
50	2024-08-20 00:45:00	15	aug19-845
51	2024-08-27 00:45:00	15	aug26-845
54	2024-05-16 01:30:00	16	may15-930
55	2024-05-23 01:30:00	16	may22-930
56	2024-05-30 01:30:00	16	may29-930
31	2024-04-04 01:30:00	13	apr3-930
32	2024-04-11 01:30:00	13	apr10-930
\.


--
-- Data for Name: whatsapp_auth; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.whatsapp_auth (key, data) FROM stdin;
pre-key-10	"\\"{\\\\\\"private\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"oLqFXpIcuot/mmStuNgh5MpMG9OLCLTwDd/9idiH+kU=\\\\\\"},\\\\\\"public\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"iMmAnaFtAdahndAPtMrYqUyTgG5lhH3J8ZiBf4LhOFA=\\\\\\"}}\\""
pre-key-11	"\\"{\\\\\\"private\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"WPfrvUJvFvxorQ3ZCgRsAXWUjH8BnUZIknwP7sfhN2I=\\\\\\"},\\\\\\"public\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"FALtd+ds3KEm/gfHpB5JaHCsoqvtrtaMosSCILflJx0=\\\\\\"}}\\""
pre-key-12	"\\"{\\\\\\"private\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"WJ7xX/tAzPUAm0ERk8BAlbfrFkI7hDzg5GR9uEsdZm0=\\\\\\"},\\\\\\"public\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"k+wyOBEIlhOrx68mxHz5YmRZ/zETB8GpVp2vkcqznxg=\\\\\\"}}\\""
pre-key-14	"\\"{\\\\\\"private\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"OJhBW3G43H4xJvTz3YizHaFFdxvtc1Hnts7n6xpN2Xg=\\\\\\"},\\\\\\"public\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"c1WNYRc5HynEZn3xxE4rR4buyO70wDhttPCAgwOenT4=\\\\\\"}}\\""
pre-key-6	"\\"{\\\\\\"private\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"OCoIh6cPaUu551jIL5wxJwfFomu+2MFp8vi6phndEU8=\\\\\\"},\\\\\\"public\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"gj8bBUtB3nmHs0CRnmGxYBsFLnqGzWWZT+Rg//Ln40M=\\\\\\"}}\\""
pre-key-2	"\\"{\\\\\\"private\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"CNAdSxPOIEdVw8IBZQtUO7pvSSPj6S62rsMH7LTWWnQ=\\\\\\"},\\\\\\"public\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"uOmv8KmVpME924pV9qOeR8lbm076TAxqVW46afTWRXE=\\\\\\"}}\\""
pre-key-1	"\\"{\\\\\\"private\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"UMppZU5uUylfCB2h7ugyQUawH7akBVswoPdDC67aWGw=\\\\\\"},\\\\\\"public\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"VqIEIqgv9QTSBILxLWXrHw/RnwyuWRJ3/YANC2HRsDk=\\\\\\"}}\\""
pre-key-4	"\\"{\\\\\\"private\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"IHobsfxo8uTR02Qeeg7aI3h5zHZJZtgWfiljzbc4qlc=\\\\\\"},\\\\\\"public\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"TkLtIVmLjkE4tw5moqx2hGrBFetSuryNYGWyIDfw70s=\\\\\\"}}\\""
pre-key-15	"\\"{\\\\\\"private\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"AJkmMhqL/eHlp1vdzgn9CkdZhv+DsGEaa+dyVTKQDHc=\\\\\\"},\\\\\\"public\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"YyFydpXVel/y+rmXpGfQyQtPpZkCVa3CCb8OCD/3BD4=\\\\\\"}}\\""
pre-key-3	"\\"{\\\\\\"private\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"YHFdq5ntSRxOzP3OuD9RHOvzztqgufYq5DnLb1N+/mI=\\\\\\"},\\\\\\"public\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"KJMQnbw25fs+C5GSK5eASW5Q3c9gxqdtN6l/B0O09yY=\\\\\\"}}\\""
pre-key-17	"\\"{\\\\\\"private\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"mMzdUcxxcHXqxsuzmXLGuTmBAkJwm+6sCGcpeXTL7ng=\\\\\\"},\\\\\\"public\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"z8bJoARMhhX2V/aYH3J+s39LNpyAibcx/zGqmt2sPFc=\\\\\\"}}\\""
pre-key-16	"\\"{\\\\\\"private\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"aNjXny0tZXh8//M/7t6uQplTDvP3+TC2ITzwOhkrsHk=\\\\\\"},\\\\\\"public\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"3kJ2vCsIifK9lJsOR9WPettn1ofruyp4cWexcfmsWgM=\\\\\\"}}\\""
pre-key-9	"\\"{\\\\\\"private\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"uEv7QJdVWPhbOG7aXPKerYFNVnDdrQqfPcylCJ9s1GE=\\\\\\"},\\\\\\"public\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"DW0aROk0OBWudqRvk5Wqa1UK17VVImGRljlPHdIURiw=\\\\\\"}}\\""
pre-key-23	"\\"{\\\\\\"private\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"6Os4QuHeFRqvNRd0tiRKne2jyvB3WrOa67m4jni8wns=\\\\\\"},\\\\\\"public\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"ig4cqUkySDyBlIUHreB/hppV63YZAf+4BEsWwa0/+RA=\\\\\\"}}\\""
pre-key-26	"\\"{\\\\\\"private\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"EHnlTDdMsgbYeBzCqQSDpGAA47HLSJNiFT7jYLi/4lk=\\\\\\"},\\\\\\"public\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"rn2UlQRcJnbCUP+v7ZyiQ3/i1v0ZOwcKB8ESMFXvuyE=\\\\\\"}}\\""
pre-key-29	"\\"{\\\\\\"private\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"aG7j0nGTa6nLjIKiTSxI0wTrw2TNsctLxJUZunwV0Gs=\\\\\\"},\\\\\\"public\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"vcpWU0zSDiCQPeVNrdaaSLMFb7a3GT8yeET19CvnmxU=\\\\\\"}}\\""
app-state-sync-key-AAAAAL8J	"\\"{\\\\\\"keyData\\\\\\":\\\\\\"mgu6SyNwROi43jtCPVixnzjQlHEyvLOEEMXligSSrE4=\\\\\\",\\\\\\"fingerprint\\\\\\":{\\\\\\"rawId\\\\\\":88319481,\\\\\\"currentIndex\\\\\\":1,\\\\\\"deviceIndexes\\\\\\":[0,1]},\\\\\\"timestamp\\\\\\":\\\\\\"1712777801375\\\\\\"}\\""
app-state-sync-version-regular_high	"\\"{\\\\\\"version\\\\\\":10,\\\\\\"hash\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"LMjxFSwv/Nyb4VvkIFP4xKpP37LVHgImmBDxELXx4rIk6j4Les4SZngsI4zmg2DzBL4aoAlX29kFwLiUf5mXBZiMoNbHnqggScetSlYMw8nOlHW/mkgXrXp8/kE3+iThPIp+/kAtHdPOkNaetbUyc7QwxfZJ7EQ2fOxcunoN+Bc=\\\\\\"},\\\\\\"indexValueMap\\\\\\":{\\\\\\"GmTJNSppeR4IJgorRITYySsS1TJPohMxWVvT5vuIyQU=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"yCpGtUeNbS0qjqWclcTJxRJRkIGZ+xF7aXcD9hWxrS0=\\\\\\"}},\\\\\\"deHxrFs26HxZF7vduIXSnJC6aW3EfX2zElv7JWDCPgo=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"0Kf/M7IT519FMEifMlbIyJ50ind//n6Jy40mIsWru1s=\\\\\\"}},\\\\\\"aPOGR1f54Yz7jHXbGXbTN2tLl03UyensYqOwNv8eIhQ=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"HLXDuzdT8JpjEI4mgnnM/QLESAPG45XLQEVd4gH+oX4=\\\\\\"}},\\\\\\"nMqXl9+ZMnvCOtO/6+7jnrwVTd52H+XFzqfRZCz45mQ=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"Qdqj4biqj5c9uNqnPrqHRJYwen5WFAVS13jW1KA4kR8=\\\\\\"}},\\\\\\"+t6PJgRuPHbrxKIZ2KWLMWiezQ8rg+Ie7SF/wobfyH8=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"ZYbxNaIA3Oi6r4mNY5taMClSi4GbI5o1+gHX/BRJrgo=\\\\\\"}}}}\\""
pre-key-19	"\\"{\\\\\\"private\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"oCxYjk8WsKaq+PdXlewdgTOXwmiWUt7XF1MmdcdoLVs=\\\\\\"},\\\\\\"public\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"VK/SgKQA+uAtWVCgzVWvLcGa8Np2rH9yg9IpbXyDdQY=\\\\\\"}}\\""
pre-key-24	"\\"{\\\\\\"private\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"4JkOaJD26u2g259t7ImQo7NVLX0wztKFcnzkAJSUJm8=\\\\\\"},\\\\\\"public\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"Sd1r0qVm+CNb86FStbrX2ITpoaz2EszDDCAWXqNVGg0=\\\\\\"}}\\""
pre-key-30	"\\"{\\\\\\"private\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"qHJBY6BpKF1IPPG3Qf7+ega/UVjAW71wQewPPyqHynw=\\\\\\"},\\\\\\"public\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"5AIez1xcFTr973HBxw4X09+Z6o12Zp8BPjeJW7mz0GA=\\\\\\"}}\\""
pre-key-21	"\\"{\\\\\\"private\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"YJuvqTzitshOp+7JoJQGW0QqsqTBxdTbd1uS/lmG+FU=\\\\\\"},\\\\\\"public\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"IldU4uKWTTjHvb/dXbM7amMJq55B18RyUVoizvILnyk=\\\\\\"}}\\""
pre-key-25	"\\"{\\\\\\"private\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"EFRx8yGMtiAPvBpggmmG+FMcPwASylUzEVhXNswQLU0=\\\\\\"},\\\\\\"public\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"EfMtierjbAI8kC4I8M0BLxByrXtdbTbedYYbz2nYKQw=\\\\\\"}}\\""
app-state-sync-key-AAAAAL8H	"\\"{\\\\\\"keyData\\\\\\":\\\\\\"9ePmiGQjgJIjQPhproSdyoRiQesWltdqSfqsNPrgpgA=\\\\\\",\\\\\\"fingerprint\\\\\\":{\\\\\\"rawId\\\\\\":88319467,\\\\\\"currentIndex\\\\\\":4,\\\\\\"deviceIndexes\\\\\\":[0,1]},\\\\\\"timestamp\\\\\\":\\\\\\"0\\\\\\"}\\""
pre-key-20	"\\"{\\\\\\"private\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"gA3sv0JT1pcQbxliE/hn0prrI0HcOnkq7jGZTmcjfHM=\\\\\\"},\\\\\\"public\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"grMAi6Nu4MfvcIDBXjn5JSa3+hO9hoOvjjAKjAFonVI=\\\\\\"}}\\""
pre-key-5	"\\"{\\\\\\"private\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"SPLFXYuSL0nnjNihs2hb9aa65GYR9+Mg0dC5taClNnQ=\\\\\\"},\\\\\\"public\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"I8qJxytSYe0O0GPztZqT+MgEdUjf94A8fIlbsXDDUiM=\\\\\\"}}\\""
pre-key-7	"\\"{\\\\\\"private\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"6MRScw8MSnau6JDB+oY12ngnaiszPdi/l5e+Qmno+l4=\\\\\\"},\\\\\\"public\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"we8WIxGPFAik7F4XtHZk0+m7MTbJAYYJIjGTskPoh3U=\\\\\\"}}\\""
pre-key-28	"\\"{\\\\\\"private\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"QOqygVUfCr0NlSqkvjXTpRD6RhUUvtRdty2zRogev1A=\\\\\\"},\\\\\\"public\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"kCRUCBoHjhgnd9G569rNBCv0nznL+En2cVtFvwNHlwQ=\\\\\\"}}\\""
pre-key-27	"\\"{\\\\\\"private\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"AItuT8zjIloPJAD8qsGdb3eZkdYEzl58G7iOzrJx80I=\\\\\\"},\\\\\\"public\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"F+MBMNg82Y7Z2x+FO8TP0k7Eu1Z+5azyCMm5tajj/X8=\\\\\\"}}\\""
app-state-sync-key-AAAAAL8I	"\\"{\\\\\\"keyData\\\\\\":\\\\\\"LTeZX9b4IpXfmq4xTd+AbU/9dBFiz6zsQG0Ns5EkCyg=\\\\\\",\\\\\\"fingerprint\\\\\\":{\\\\\\"rawId\\\\\\":88319480,\\\\\\"currentIndex\\\\\\":1,\\\\\\"deviceIndexes\\\\\\":[0]},\\\\\\"timestamp\\\\\\":\\\\\\"1712176993014\\\\\\"}\\""
app-state-sync-key-AAAAAL8E	"\\"{\\\\\\"keyData\\\\\\":\\\\\\"+fUHhb0QKm4Op+aCYfcriVqZePhOGmTt2v1oTxmoGOY=\\\\\\",\\\\\\"fingerprint\\\\\\":{\\\\\\"rawId\\\\\\":88319466,\\\\\\"currentIndex\\\\\\":1,\\\\\\"deviceIndexes\\\\\\":[0,1]},\\\\\\"timestamp\\\\\\":\\\\\\"1711484995685\\\\\\"}\\""
app-state-sync-key-AAAAAL8D	"\\"{\\\\\\"keyData\\\\\\":\\\\\\"qylvxS+f9YN5ZtqFsJZll4bhw02aUiAoh9YWMqhBxBQ=\\\\\\",\\\\\\"fingerprint\\\\\\":{\\\\\\"rawId\\\\\\":88319465,\\\\\\"currentIndex\\\\\\":1,\\\\\\"deviceIndexes\\\\\\":[0,1]},\\\\\\"timestamp\\\\\\":\\\\\\"0\\\\\\"}\\""
app-state-sync-version-critical_unblock_low	"\\"{\\\\\\"version\\\\\\":20,\\\\\\"hash\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"VLYvr4Nrexi9Gqi5sKWwy/e+S5Dg8L4qWMKjK2ikPyk41UaM2+4suvuCRtYe8itmCqlv1oWWsE7RYIBCIn/JdYJ3BHRtdBEViJUhGL9RGbcSnKKjyqHT0pmdD2f9eHytI9YYshOcjwTJ3eFAatYeWjyE4l9Q6GUxAwfVvLBWwXQ=\\\\\\"},\\\\\\"indexValueMap\\\\\\":{\\\\\\"AdOZjGqDxKDhDQCIW+RVQp9A3GccMW+QNMi8oDfzPmY=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"3c1rSerN/9SrhW4G1eFjij20iQQDwVwkYxNjxpd8dPg=\\\\\\"}},\\\\\\"A8yAthz0G6LxEMrcy3CjLv52tb12etASHnC+Ex397l8=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"EXb4mn/NFYNvJCWMDvm3AHe+982nke1EMtYvQQM5Ymg=\\\\\\"}},\\\\\\"BYOuMYTKy3LNGvJcV6xcDK9wKRX1I1FKZEb0h836o98=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"mQTSqb6ZqMCQe/F4RJfwbmOdmFBdQUZWckqcWP0p5bY=\\\\\\"}},\\\\\\"CIvz9p2itLKPnTUQzjNHZnbVJF9x35y4/7ii88wmeN4=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"qbNw5QJpp0sPi5hZ+7xtxcIvaxh29XXLQT668twkhtQ=\\\\\\"}},\\\\\\"Cw2ML179ryCqGLRRXw/5O/d5bEOXRf6E6S5BP4VIgko=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"CEW4NNk9UWLZJG3iMV25087YXaRw1o1mK+bEcIQrpcw=\\\\\\"}},\\\\\\"DMshz/cEidV2UZzcn895/6PcKchqNAjfwCSEzTqPTsg=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"4ZJ6Zo/f8aWE9fJNibOlKcDRa088MiKKQrY9/CZ+C+0=\\\\\\"}},\\\\\\"DPSx6jwOScQIQQzvSbJtmZmBkmO5wXFWO7kVke29GC4=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"H3JiQyHzrl1q5o1bhXU674If34WQecb84FoqtrnCEyk=\\\\\\"}},\\\\\\"DwcgLNv9yuevzEIGqf+xAlT05NkNknHTdtHcNS521oE=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"+shGAG9gt5JRQYPFhyc+pShL1RtigKKVzItFlEbUXYA=\\\\\\"}},\\\\\\"DxsaqgAy9CxxkGTTvSI0Gj+7Z5N6MTJDjFUiTVrkILs=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"cIYh9M6t6uZtmHNwRq+UIy8AdLBWQgCToDrU0odgwH4=\\\\\\"}},\\\\\\"EOfsrxYpQzQ7zJW7q9tbljF/AQuWYZJV+Nje5mntFy0=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"qTjHUkwLTjIDpGZsop/UoSfwPcuXE6ZQPlZCpTWTv1s=\\\\\\"}},\\\\\\"EVX0St4EViHXgvWFtwcNFUIMJ3TjI8bT0ShohJUw3IY=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"Yh1jW7aTBn1evZdM47kMQGWKdgMLgSR4DEN7JmloATY=\\\\\\"}},\\\\\\"EbHMeibtAZuGOonLHC13YomEBOjbKBqv7z5cxM3S3ic=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"WamlLsABNd/sVgu0RiMJF/QairD7ICur1B9uGyHBy2w=\\\\\\"}},\\\\\\"FF5u3EDSbUIAyUHvcRuiQ/NxbAUFth98KS72YJdypWg=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"VBTd9PbDhlM2AQHV98sKa8KU1t2NvpWjVtz6kTRVX8M=\\\\\\"}},\\\\\\"FXXHGE3nK5/7jJ3iId9qs4yymNEq6MD899hIOU57pqg=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"f5aP1qNK+oWMDGDbV0mD5YGRSmkwAH876CH4JVFJbwU=\\\\\\"}},\\\\\\"GtQlodOuVvPP5N+5G+XQEe+6ABNnQB/LO/9yVaZbjxk=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"AJ6ypDMtLRYuyfA3HvaZma4sPQZopC/qfkJvyetPrEY=\\\\\\"}},\\\\\\"GuwV0pxijo0CAkymNvlMhO9QPfn/d2uSyX6nkaNjObU=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"rVNQVeghQMnnyrSPdhN+1VH1JmHhk5BrG8TCjWkmihc=\\\\\\"}},\\\\\\"GyPX86F3KFtAc29HMQgQFEd/Uwlh0zK+ktUMKZRz9NM=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"tJ7oeFvzGcjPxMCWGRkqx/zmDSMMGx6R504h2+rFhDM=\\\\\\"}},\\\\\\"HGNezwWUXK4dVwGMcL9I9sH7GBc2+nVw4jjFX0eMWvA=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"92VDPdA+RDLF0xtphcv7718tTRZ4R2xdIU5mMMUvGjE=\\\\\\"}},\\\\\\"IgGiLZC2vN1W0LFb6iyOBLI/TPjc5MQLWLgAotzjzF8=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"Whq3MOqAdBxjsNe7vIF29z9VYC0PMwGk8bTO1tXBOnQ=\\\\\\"}},\\\\\\"Iqn6eRPQ4lK6VfadxqVFDlYZ+/mHy+4vnj67Y181cF8=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"OCs7QibKpX9TetgBbjggZXxUx6kKGqai/zjLr5n0HwU=\\\\\\"}},\\\\\\"JfMwNCWpnZGBTIsu9PgMn1/YBsK15oAdyVa7l4ZwH6A=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"yRnOOZl9oxTlN8HcOfBitJ/j8s62r6XJTjleEx2JluM=\\\\\\"}},\\\\\\"J6lGU9OE8kk8QwhIsEg4TcrWacOlZW6iwkIBopOLbvI=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"QrExWVQKK3aWASP5GnyzfafOCVWXJeBxi55VV/+PXys=\\\\\\"}},\\\\\\"KmcVdqzFUEBSp51cMIoA1wkVU7m03mMkKtKf9jD7f3M=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"wLcWNw8Kn3GGZVgeh+G0DF8Zl843rf8/thGCJF4ogOg=\\\\\\"}},\\\\\\"KqK7zvi6QMZf1wgzhOrQ+Prq7mRy+OnidXHgIkcz1BE=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"x4xRZl/g9RNQHdZecEfDOA9Yu+N81bL/y8baQMHmpXA=\\\\\\"}},\\\\\\"Kq1qfxJH9mYzOr5HjlSJ/ceQd1AxpMyhf7WI92x2cB8=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"wr1R5d8sPWCkVdjuQP4hx9b5q1doKMP5Ba0N6oNR2CM=\\\\\\"}},\\\\\\"LX+ftYzl7EYo8qaSMvdM9ada34Uv7swScny3GH5GRxk=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"jXB5wd0kbGO9n+sCg1AjRPXlVnHGsb46PHQY6GMZEqo=\\\\\\"}},\\\\\\"LveWiXZuymYKjt/MuiO3f4uxqeQ+T/4Bb6PDF0sqm5s=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"exyFYHnsSRM/wRWSiiRS1zrgvo7oFyli7aL4KTArz1A=\\\\\\"}},\\\\\\"NG+6R223rX0PIm1Y5JWHzXvEqpBgKyh1RR5gcn6xpL0=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"1Zmvn2UiHQrpy7c1cGIq21RtWu9vPm4f/2btlWMxYKM=\\\\\\"}},\\\\\\"NuWn+OK/xl26jU+ro6BdJnPOZSFbifRud3i1X5tf0iA=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"DediK0edzpOi8Md5WoVjZaY7lIEA02sXOf3A3LvbVc0=\\\\\\"}},\\\\\\"PBvE8z4UXbEe3OoqmG8W8RoiddhGEP8FHqIq9RprjSg=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"7gRr/5yZl1atul2Vdevy+gH2oFsIM63KNFpXAQqEhtU=\\\\\\"}},\\\\\\"PCggnC53aHaMm3ZnKbUcf9CsBfp9cUXknjt7FQDVQoU=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"ELmXDFg+5iEbqrvK6zsYotdRJH6JVFZol3+wATs3nwk=\\\\\\"}},\\\\\\"QHhHNuc1p5O6YKlEgzTpwbOMsDsHtS+RqGzTWA9kyA8=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"o8SqR2u8+uCnDJSNJPq6SvFdmM1VCn2gCs5n8cFMPTU=\\\\\\"}},\\\\\\"QgDTLf2e+M2z9IQ0cFWo/Rg1quAxcpyWwYwcVfr1an8=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"++a9d4FrIREwicA0XVPfa1IJbx8ceB3ohD6ik3VlOv8=\\\\\\"}},\\\\\\"SHqN0hmiHd3fdzqAGbjeFdQuaEHs7hOd5L2lWbcTNjo=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"YKbmSoMF26gXKzyrWm0MBjEsEGdYQ9dT1EEo3LPpYrs=\\\\\\"}},\\\\\\"S5USTCEwtsnrvwnas6071GK5MFp3B89vnYskAYDAm6E=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"jdBBYitsROfIcsUnExfPvtgYPlDYK5feEDDJKXL89VY=\\\\\\"}},\\\\\\"TZCeOXeKcSjgZ2eaiXOg2APbpeNZL0FvVIE9Z/fzAV8=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"aWvVjvxcdFDp3QwT0RkhXImkVZ64bpBg1817ZLXeHWo=\\\\\\"}},\\\\\\"TZplyrRrXW2Vksl2xB4TcYG1apcokXNTRIoD8SrLBE4=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"GURD/1ryiLlDCpQ71l40sQm/uBYoOzdmcB01XNK559g=\\\\\\"}},\\\\\\"T0h1vCTpYCiTbfx01I7Gt+/uxwKedXHbt6r/ouWY/G0=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"Kk/uBJMl/w1qTy9L928FCD30cJt4YoHkJUPk/E+egrw=\\\\\\"}},\\\\\\"T+X9ZakMs3VbnPXPVBiqGTDF7ZrV6TpMkYPwN2ddcn0=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"2HXV8jJ+0iBHfYZb9PC/QsLae/79TnxTyt4IBimXW8Y=\\\\\\"}},\\\\\\"UZ41RXyke0uY9adHvf3pA0P3mC3/h1FZ6rVvczsbmsk=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"eW3zgszW8s38+0mve/8H6QhO4z6EIKHX3X6OWxjcBmw=\\\\\\"}},\\\\\\"U1P6CgWmzuGDlUMUNYDBU5bT8+rIhp8q7jRhE0Po0wk=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"g2Jp61XiXx1AjUKANoKl1eA8BD7ycr9Tkejvj+563dY=\\\\\\"}},\\\\\\"VRp+l4ewYj+1OPej+TkyWxczMfRp1o3bQizi7JpEiuo=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"KfyvC9n18x3FMIEgDThMmDkqjlI5V99CGv+7o+EOHwM=\\\\\\"}},\\\\\\"Vab2UlmLoWteQ/pXd3E5qL7+a1wEfIUN6D/rYnOj88g=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"CY2K69faiYDx0p+7HDSbuxLj0knd/mTXclsOSRNihZk=\\\\\\"}},\\\\\\"VcFtJljL7j8LIuQgE2Se64vduZU9qByrHpWaIqqFmDI=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"+19i3jYt3tNi1ZXQF0gnJaKvhEGFHJQpLSEvOyMhx+I=\\\\\\"}},\\\\\\"VkgA3vJDiCckR70D1F32lS6g0+Br/9nSgVGUpUTRK0E=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"S46YF1yPwMFXPxM2sFhC1fEYggZ2xWewiAIJ0OdRJIs=\\\\\\"}},\\\\\\"VpqGw5IqFnSCgLnC3V7/GBwofL8XHZQZQ5kJKcFTwbc=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"Q95GH9YRoms/Xy5hi2COuG6/3KCfIdWH1CKMN5PxHWo=\\\\\\"}},\\\\\\"VqzRw9dZg1Fv3BUw+Kob2HDdYtgxKocW8XYPNQ/p1LI=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"g6CmDHtPOBNvN7dXqA42qFQ7GiVve1parBVBqTe7s88=\\\\\\"}},\\\\\\"YFthE2fyIhrX2aluDgx/l5aoTIJmMRETcOAkeS+UqyY=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"d8r1sIDCNoOUh/UZS+LzWP19yegQgzWOJjCqMSEffsM=\\\\\\"}},\\\\\\"YvvrOpd0sCJhRaI5fPXo9D+tEJVp9GVI8GdhY0TyBtk=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"keV83moeTC5hr7mBf6mDqbq3JUo9CCiSkipcNd6JpHw=\\\\\\"}},\\\\\\"ZyX9W3XaAnUvoKwENtmaEJlsAJScdaV9J1W8LV0/DhE=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"JUyC5DkVJyCxUUNyyT432wpxnRz5dB6kjMjVA/iutKU=\\\\\\"}},\\\\\\"Z44u9De+AVTGbVFa7TjX+zcdkQY3X+9Rf/C+w9pqmvM=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"UyTbyYGbf/F3r0jSSpCY+6iPF2P9q/UddhTrQSYL6VE=\\\\\\"}},\\\\\\"aOrs9yGCCpgXmDuaVABWA4uI8ZhJ7x/qVx3rHCGwNbQ=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"pi4l19ULCbo9UDqh/q/RZmSJG0yqaf7Hf7wI2q+wbWU=\\\\\\"}},\\\\\\"actAf7vyVW000rh4CL2XvewpTn66qdupS6pyBJIKjyM=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"E9WNUfYuBg4Fn7RdlZOjD5gFYvhWg1dEdCjJ7oST1Ss=\\\\\\"}},\\\\\\"aySwJ2FV2nhUe8LcSIxPgZmVU/WBrY47snnV+ydqClU=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"tyJtH0C0sqVKksVQ7mRkKL4ogJcUcA7tF3mP/pvqcu4=\\\\\\"}},\\\\\\"bVXXyxLl7hMe1IFTPt9euZ/yrP1PXkXU3JPrlq7+6aY=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"e1XOk+SUJuHJSCVemomawI2VMBffVcbTYjMTeKLOlO8=\\\\\\"}},\\\\\\"cT7KZiK1LJhPvRP8XWojqtz4AUkxhwnwJtI959rvlhM=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"l6REHV1ar9MUZ/1e0rHY5QDUNe4c5I7irpFTDzNOnAQ=\\\\\\"}},\\\\\\"cs4mHrcyxFGoSO41FS4KseLV8iIoAhm7RMoCD+GQ8ug=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"WfTJpFDU/iJ8YZ0/3ISpC4C02lIgUR2x8XgJNJbmdEE=\\\\\\"}},\\\\\\"cxasasjO+6j12OLT1sKU/t5mB7c08YiypBA/Yyyzskg=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"t7GjRIx3zfjGt2QqdiLmXk1eGz4gno7+tlP5y/ubAko=\\\\\\"}},\\\\\\"dLLxr2SNm4uO7wkcY9afu5CNW+eOHOnW72eQDXHSV4I=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"ehMGTh6+6rGRx7GYgrO7g5G/Ajw0GjvZSJORJTLfPOM=\\\\\\"}},\\\\\\"dQFqha3trgyCgVTfEZ5UxrSEebJ6T3dQqyECwsLt2Vg=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"znY0ff8hbXK9eFgQD3xyff3FPlh8DKfi8GgmSBfZ5Sc=\\\\\\"}},\\\\\\"dQn5inU0JtWzTjwFIEhbn2fwmlKEs5wneaSuXaKYxxA=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"aVCjr+1S88LYs+7OrnGyNhCMZzJH8qSAnTYfyxL9kFg=\\\\\\"}},\\\\\\"dRcfyhrKp2KjjMVL/eqegfXJisFpSiTD90Mw/1oBdvw=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"JLDl/lpailtPA1lfuvgZn0r6qZQAgIqSBiHrxn+MJ6k=\\\\\\"}},\\\\\\"dp9gHRKCU9Id94mvoqNcBnIUTlcz8CstYDPZsDD5fBk=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"flhieCuhH/MgeXIOZ2HralwWq/yLf8ZrO3mI9mMInzM=\\\\\\"}},\\\\\\"dqsd3GwMWOc7yer/BmjYdF4LwKhxi259aef6fRUpArc=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"Wj6nTAhv2aFLxRr5R1TQAcdU24XqrDiDQN02K6x/YXI=\\\\\\"}},\\\\\\"eIq3jwbiw8oeqjM16pt2FDCYJ2ZOGeEYMaIWs2sb6tI=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"Tf7mI35xBSM55Dy/NFPVJTRNwaVaIEgri4ND3IZS6ro=\\\\\\"}},\\\\\\"exvjWGNkRZweAvdPwstqDmOWOkjR8DU5SBkiVeiozok=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"xsvfS3HWi/Ye6mwZeXO2dDowF756TiWkDlynCo5NrUU=\\\\\\"}},\\\\\\"fb61Z6RhQeib58qb12e8ke/uZkaUzU1ADDZFjGYxAAo=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"k2Tk+pZaB0DYA3bk2hO24ejHHuSDzPumKqP47kdeHd8=\\\\\\"}},\\\\\\"gQvoyXHRhAKUAqSIkiG+5DC0pk+DK1BPb2IhIcjroH0=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"ol0BOzYIwmAM3OyerKyhXZEqQqbm3oZ+Xi9P71nDvc8=\\\\\\"}},\\\\\\"gdTr5hAWkwo1ej0LwnK/1mT8iLUpZlnQUj/osL5Orwk=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"WHMRjxBrNNrro1ILJSG2KPlROvMWbjZPJ6EpWIOEFD0=\\\\\\"}},\\\\\\"gi48MUWRX38ZLNOVDzNBapoDJbzgUtXon4SW9jDjrJ4=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"8TbKWLkdDGW/T8ukUK99YLHRqGGzALNVVJVH8C97F7Q=\\\\\\"}},\\\\\\"gwvp8lJKS4UsrkhlG+YVCeW32XsMEX/g0xXQ3CwLSKk=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"BM5jFrjmQGNmjlZpufEaBqq88kuUII2Y7/Bo7Hfd2NI=\\\\\\"}},\\\\\\"h9bBa72DwVxweGCJM1+8YSoLxz/DcyeYHqjIrjc8oYc=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"0Ro2gYLJIEGv1JTYSr8CpDloFAzpe11Wq2yqUBsxjSw=\\\\\\"}},\\\\\\"iLkHJRfGc5T8I6ArRxZ0U7MO3hJ1h7Zni8ilMDhQGNE=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"FtRtA8csTzH4G9enG5bDrULmkAOFds4eBwA/IVwXRSc=\\\\\\"}},\\\\\\"inkAxzPqwVd/KJ3sMPOQQ7nR5xJ1+8x5UbcUQYIVZ4w=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"oOFat4c09fKMr29n0tABcb8ApvDzgm4hwPUgJlY9FV0=\\\\\\"}},\\\\\\"jgm2kL+IdPZw3+oVvxlU+Vr/INZkVfRNxct+hbKwiP8=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"up7sF14ii0XB0FG5NNV6De4QDUnnnYPxes47AqwYlEQ=\\\\\\"}},\\\\\\"j7r/rPdzkyQKF1nJBzfG23xKdN6mw0054vFZOoOPnJY=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"9i5q3Ycio6lKxZIGzW8TzO07yn83o/KegrX69Cikq/0=\\\\\\"}},\\\\\\"kqZQ4LzmQX5SAAyBtu46tlwkjBSijS63UCbyyZ00AxA=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"ic5ZUCcrP7fzvsmf0XIwfojVpu5y2pbczbEQkXKNLYA=\\\\\\"}},\\\\\\"lFma0s2/1oSPmsIhX9x5YVmODOOrTzbpkte4eIGtvAU=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"y4u0B9ZvODIVQ4ywYSajNZEiwcEpt/GcL2CGxr+VQxM=\\\\\\"}},\\\\\\"lbqSA6JsV2GbieyVkRqcnSG4MfzxcyamBhv6c0qw0qs=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"v7VVBBgSvsanH8ZaaBzmWZ3nFLK2HL1/tz3lUBX/gyk=\\\\\\"}},\\\\\\"mOihWOdyx57DCyHb9wuDtXOk7KDZ9iC62CMkubspOsQ=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"OOGU7wMKHysI71VMuYFP+XJpbssJ1LJPmcFnjxQmb1g=\\\\\\"}},\\\\\\"mv9KtLc78eOszg7i/0/rY5lqmYUm5582c06BHK+uB2o=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"yTS1JWBPfGGnXcnq0tvAOjV0AxixXEKNAFMFHRmATww=\\\\\\"}},\\\\\\"n4btvzkJ+Adxe5zWm4r0oLRoUBA+AlCzV8ZPfgSLvh8=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"TesW3/PlqUUZL/bs8hUo2al6eeRJu4DQ3IAT+hIiLu8=\\\\\\"}},\\\\\\"oZeM3pWjNaTaVKSEc+PXRaKmj+51hBu0iMr/mNQnB9w=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"LEjM/t7le5ul53ZTk1tdHygLA8VD4KYro1SPz0p6LeY=\\\\\\"}},\\\\\\"p+YAB4Oa5RHBcpIiYON37unNEzsfLwT/J6tUKbmP7Ac=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"nMCQmRqlaCJoaY82RRdFqjif2Tfz3xYxnUPdMRUJEa4=\\\\\\"}},\\\\\\"qxtnikBM3A4+fRBV0h/XdtRBdJCjH8fAp9Yyv4Ta+wM=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"XIB7QB9PfLpOP+b81t/nkSprTMVhBBzcJFJhDDHCzJ4=\\\\\\"}},\\\\\\"rAx6hDkswYw6FmvooR9bXAXwaj1eSGTwY6faWH7mFRc=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"VLX2NJU/2F9bB3zeX2rM59+7dECZKahash+0Q9AoZp8=\\\\\\"}},\\\\\\"rL1su9KJk9fWWnszLqD00cSaOqn7JAjB1R+fTyf4TMA=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"eFN5pY1Ii1qWDrkt/N0b8yBsJAS4a0RU0eajD94OZcs=\\\\\\"}},\\\\\\"rxocb8l8FqHT0uzceCFrw6iMiJEq4ZN+Ewf6pT9nOBc=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"BWrVf4teoptcj33z7gb8nLI7BNImz+VD/q2VK0tA42E=\\\\\\"}},\\\\\\"sb9B3A870vYk6MZAUSxwKXdsltpyJjjz+HDYTvSGErU=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"al5nfK0WPINg0JdoH/qRWUA5XplJvcyfsFuYP1OidSA=\\\\\\"}},\\\\\\"tAoPJVhYneoz6RnkW/vIcEAbuzIa+yr9BP2MeXzOMXk=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"UQ4cX38e+xB3gA5VnlO0agw8kxq7VRtkxYn3DNDTPoo=\\\\\\"}},\\\\\\"tDcIFbVFa7/9YLz3fOikMx/wr2xxzvt8GvcWJFBbomo=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"taQrAaP+i4bbB46oOwKxy04fDxStmtBfR35jAj2Ypl4=\\\\\\"}},\\\\\\"tT7jrf0vuW23YhbLiUleF8QUOGbEGfmjsLGZHxNuQG4=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"A5guAQYAW/51xGuNwaj5b27GVqQ43iM5cSh1z/bhJDY=\\\\\\"}},\\\\\\"t414qwOoNw6vTAYAChQ9lzrUbb1JZCdlTCuU8CuBGbs=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"Id1hSKhAoPI8sRA5b09DWIT6FWgIC0iJnJuCq+M67ps=\\\\\\"}},\\\\\\"ubrgkb9rQJeqgsVabHp3dnI4y8z8MlseOQKjUKaTpT8=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"ysM52t1TqJ4VWlrTScRLr6snU0HBuzdM6E6rxOK37xw=\\\\\\"}},\\\\\\"zq0BWXqZAsFfU/WTiSZ8eaGrZkxFnc0csyGhWjp4H9o=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"OaWnvXAaDVQRTWpKh7ip1dHMkaLKk9k4/FWwSFwroho=\\\\\\"}},\\\\\\"zwFSylMO1ZbcYLwe2l3ciov2av7G42p6PUXzgJ6amTw=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"OioFKYAkVpU0Fa8Ag0ZMceV7yoPwCrsq4ED9unv8Ip4=\\\\\\"}},\\\\\\"1KCzl5I5l550d4LAB/cTh5PDZb2nMTzPQNxy0RAL2Us=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"O85NexScuW5JA91BPyviHN/xgKE3HX7DCkmiAm84epo=\\\\\\"}},\\\\\\"1w1kqu1q70TOmzflYD9BouJrHaUXqRX4K9AG5OzB9RQ=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"6pc2GQDUajfqcHKcQl4iBa/jFgHdRSzGSa8tANW9xhg=\\\\\\"}},\\\\\\"2NiNOTbh93QAuk5dFaFJABv3haqpyIhhidxCf5X17T8=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"a6HHxjRuEkZbMh2rEdKuLX2lAdeOxqVW0fzEPPjQc3M=\\\\\\"}},\\\\\\"2sVCoxgH+XJqGYzIFlgVBOK/ktHEDbyvgWMTE/j2hAM=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"sw4ZGZJ7QNs8SHuhvLr7meGNO3hla4dRzM0vvPs7K3Y=\\\\\\"}},\\\\\\"4p7DMh5VJTNZzJTUfkV4qz0d9Equ8nVTCnBE1sAbZxY=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"hbKbPcM5z4j1l/uBnvDbxDjtIlWGpCdwaPHUX4Dmeg0=\\\\\\"}},\\\\\\"5X+fDSmuqHGouYjaRVZoXKnhRTuXWYsKIHPGYbaO5lI=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"7DiN/8GaUvJyCP6uqIbDpP7EV0Qtt009wJq4pqTK/Yg=\\\\\\"}},\\\\\\"6iisrC1mdMgMl9n1wZPR8NHC4AUmwwOejWSYlQZb3JM=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"1/DnJl3OfM4PAsfDFP45Ytsufg33fTXCAq7KlMAktLw=\\\\\\"}},\\\\\\"7YirqGdRstVW5I9t0tQ1sghDcsCoU8tuAG//YMu2C3I=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"usHuJp0lZZCxdDChjgexWHH+16NgcpvMSxwtbj4VU+0=\\\\\\"}},\\\\\\"8G+1nBtPZY1KHgJ9dpHYdxCCE69Zw0bYZ5z/rmVHwHI=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"agE5X2dhGeJm5vD3f3LP1O4TMahdd5AMCUtiH2TziUM=\\\\\\"}},\\\\\\"8QJaceD2JvUwV7j5VWImmUvg9FUeAsjO5MQyYPSNyQk=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"VmCCWu/K3Qi5Iq/OblgNgZsgXlpdbBsoxF4tcl6LLlo=\\\\\\"}},\\\\\\"8Y2HHTV3lday73jYCcud6zhZu8pvKfRzZzB135f2m8w=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"5KRwu81Q2LUUeCeSOJDpc4eLUolRO7pqX7v3eL3q6OA=\\\\\\"}},\\\\\\"CFiim6Fj55GAG7P6Tbg60Udc2OEZkRCjoiLMWtxBAlE=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"JRw90gUBHg7pNCnNF0dBXu2+iMxNIK7jsXsUMnXc3a0=\\\\\\"}},\\\\\\"BCk7LQeFCaX67F31nYDW9BLmy6n/6rhSSX7FCZqJDE8=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"X1aLGxekW64vNYw86PYLozzNTcnMaKmIF1/7fdBBMIE=\\\\\\"}},\\\\\\"0Mof9zwgGWUSoZTXmYta1Ho80F0kC7eaoWMeYJAv3SA=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"HcvCGrk6QmPPLIdetsLpihM7v38rveLY3xltzc6RR/M=\\\\\\"}},\\\\\\"waV07uPTJrhhjjb8yjsKJNuZ2H3hAJaVDcJE7xewdAs=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"1qdrw6Az3zcfSdhQzdAMfXZm3XB0rdkNEKwhMjVOwfo=\\\\\\"}},\\\\\\"Y6NKac3HOm0lnA7kn2ZK7c491DrHHoXTDWFli3MpL2k=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"z666c9WkMVVK8/3NNYVs0/Pmprs1Hg3WuixnbcSxIeI=\\\\\\"}}}}\\""
pre-key-18	"\\"{\\\\\\"private\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"mFZAqPatYB8x4Tehqrk4zXQVk0phPV6IdcotQTkxPHY=\\\\\\"},\\\\\\"public\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"8vMXWvFllwUvrj1wQ3ZluysSf7nL//mOPmh1Qk1rhyY=\\\\\\"}}\\""
app-state-sync-key-AAAAAL8L	"\\"{\\\\\\"keyData\\\\\\":\\\\\\"srUGzVSrsaEI5nlG9LJ8hPO8VEsj2kISW5BsUaB8KUY=\\\\\\",\\\\\\"fingerprint\\\\\\":{\\\\\\"rawId\\\\\\":88319483,\\\\\\"currentIndex\\\\\\":1,\\\\\\"deviceIndexes\\\\\\":[0,1]},\\\\\\"timestamp\\\\\\":\\\\\\"1716304190535\\\\\\"}\\""
app-state-sync-version-critical_block	"\\"{\\\\\\"version\\\\\\":10,\\\\\\"hash\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"Ko8AX5CvsluEmbGc6vLq5cmVBJWMmfyNwRp29U2itJ+wj979PwceCIrke/CkpXqjyqBaa2k4rJ2Rg7MSlgt/aUxHfQxDNn2MvWMf2SkuoW199IElA3L5mnpj9aEDPX/W0Vtz9fPGfAQgEDtxKmyT+ir8Xgy2ntLArFeCfuuPnzM=\\\\\\"},\\\\\\"indexValueMap\\\\\\":{\\\\\\"GgNSBUIFYCIRlWRt+JUw/XYbdMrmzLd3T2M2UuF1SuA=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"wAbPMqvvv3qYDGSVySCgeu4kFHe+5FgDvngU/7cyc7w=\\\\\\"}},\\\\\\"5geDT9owRDq9yDNAnIzJh736ilIfnhR4C4Ap3xirgzw=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"gU6EnfaF9WJ9kFJkp9dq7UlfKkeeidxjibGfr+eiML4=\\\\\\"}},\\\\\\"PdN6eRZfAVqY4V3xYtzYRT9HIYtZT35ZhXn3WWMidNQ=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"swciwDXtJj9XCcAbeODFCh3NW7zvxI/gwdDVxuOHIHM=\\\\\\"}}}}\\""
pre-key-22	"\\"{\\\\\\"private\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"yOSYEuu4u2lnJQxCzUdqcUdc7dLsnHmUsacQiwQl+3Q=\\\\\\"},\\\\\\"public\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"VWbKYXSdwDxfM/7qpF588wg0SDu3VAxHNZyGRkEwsRs=\\\\\\"}}\\""
pre-key-8	"\\"{\\\\\\"private\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"QHhChxPQXrn4vmy4nkT5kX5Ff65QTcDts2kqIHHYoXA=\\\\\\"},\\\\\\"public\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"jnGAbXQ32sTH1ICDUMmXtwGzN/33vgNg7zdgBVyAZGQ=\\\\\\"}}\\""
app-state-sync-key-AAAAAL8F	"\\"{\\\\\\"keyData\\\\\\":\\\\\\"knxwXdlVWeRe7qybn4JdBWnyuOWQX1fOuPVFllbwNUs=\\\\\\",\\\\\\"fingerprint\\\\\\":{\\\\\\"rawId\\\\\\":88319467,\\\\\\"currentIndex\\\\\\":1,\\\\\\"deviceIndexes\\\\\\":[0,1]},\\\\\\"timestamp\\\\\\":\\\\\\"1711499217146\\\\\\"}\\""
app-state-sync-key-AAAAAL8K	"\\"{\\\\\\"keyData\\\\\\":\\\\\\"labaQTnK7FoUFkUdvkQBfRG7TSBeZpwzvvam4AuKdNc=\\\\\\",\\\\\\"fingerprint\\\\\\":{\\\\\\"rawId\\\\\\":88319482,\\\\\\"currentIndex\\\\\\":1,\\\\\\"deviceIndexes\\\\\\":[0,1]},\\\\\\"timestamp\\\\\\":\\\\\\"0\\\\\\"}\\""
app-state-sync-version-regular_low	"\\"{\\\\\\"version\\\\\\":11,\\\\\\"hash\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"k8OOUJ/5qH99jmdNiWyeyNffa65QWXV96TJfm+oD25EgMDl8wbxB3eu0Gey077TT9rKbESJzEVeYjYFKhw2FZBOYxLRgW0CxNTE/VedXnsVtIr1x9Brd2ucvVAy4L30lHe9xgYubTEGEqOTAUHisLIvExSBOqfO4BdLAbOGG6Uk=\\\\\\"},\\\\\\"indexValueMap\\\\\\":{\\\\\\"9V0lFpwaNmsDx+ISRVRG+jI0EwdgS8AXtJ6cF/kx/Z8=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"q1WIQrKfR4Y7V1X461m4I6HEeb2LPPPBTsCXCvEU1ec=\\\\\\"}},\\\\\\"FHZGBiSKWndyT86PAB2BM1I72OAoDJeXaVDWUJzlz9E=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"69UhojsYqbadcQZHaDCACuVhMjD614IFyI1WKX59HhA=\\\\\\"}},\\\\\\"XSOaOpEX6dnlSiS/J5UmaainK2LDr3g1qqVssSLkipo=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"zC+h+H5WfjqMAWnOCl0CGtSHy+92tJAVdBViYgjnK4g=\\\\\\"}},\\\\\\"or8jT4/iRAAQVeJi+CtvVZZesUNEPEAhKLx7AVNXpgY=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"mZmRXvfI531wDeVY8IqoxWuLapmJ6ZAV1h9SJHkRQL0=\\\\\\"}},\\\\\\"xNxDfT5HL4ANgFOWXouibdoy9ghJOnM+g6vDdJUNMsk=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"U3OkvG1/aOAK5SRfOGSOvxy96CYcIWguQa26Cr9ujYE=\\\\\\"}}}}\\""
app-state-sync-version-regular	"\\"{\\\\\\"version\\\\\\":8,\\\\\\"hash\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"bzKkwKzRSOW3ymS5L21Ihm6RR22BUlIGdGb+PNwaXnCAfu0gr5lG62oifZqUM7vRL5RZ4GhAa70Y71a3OdHVFJGFjrA5s6owc5D51xgXsQDuqvqWK7EYr4w0gXLK4rKcTMji9l/lkmWYbOzJ+UueFaaSxcfNE/FAoiM2iGmrzD4=\\\\\\"},\\\\\\"indexValueMap\\\\\\":{\\\\\\"wZCV105rMTp9+D5C55kL/tnXSpsvnPDJjkuoRimuXRQ=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"iVY6vRV7N3vFGzHPeB3roOYgT05VxQKtdRtXGdWFsAc=\\\\\\"}},\\\\\\"H7VSRfh4siQKiXBWYs+joJtbl70i4h3foRm5000yfzA=\\\\\\":{\\\\\\"valueMac\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"Z6nfjKm8GOyMoW7yMCTNdY3eJuYgBPXfHyKPMe81lqs=\\\\\\"}}}}\\""
session-16477996282.0	"\\"{\\\\\\"_sessions\\\\\\":{\\\\\\"BYdyTwoANKb1jV7gD8ELSvktlf+vC4e+0W6aLGvSvCk2\\\\\\":{\\\\\\"registrationId\\\\\\":1805598077,\\\\\\"currentRatchet\\\\\\":{\\\\\\"ephemeralKeyPair\\\\\\":{\\\\\\"pubKey\\\\\\":\\\\\\"BbXZQ6juzxUgh77KAA2JyL+iZVs6yY7kWAUAVhLkKR1o\\\\\\",\\\\\\"privKey\\\\\\":\\\\\\"wGzbJJ0A3CO7q4B3V11tELlkxHz5qAsvOx1hImLM9lQ=\\\\\\"},\\\\\\"lastRemoteEphemeralKey\\\\\\":\\\\\\"Bbp/5wYXbYqUEYcUsDsEECl5DPuV16j/IJYA3wMqOQAp\\\\\\",\\\\\\"previousCounter\\\\\\":0,\\\\\\"rootKey\\\\\\":\\\\\\"Ku2lTFISXLdEDhu/JOnKgteHvS1UqRUgElSJenA7uAE=\\\\\\"},\\\\\\"indexInfo\\\\\\":{\\\\\\"baseKey\\\\\\":\\\\\\"BYdyTwoANKb1jV7gD8ELSvktlf+vC4e+0W6aLGvSvCk2\\\\\\",\\\\\\"baseKeyType\\\\\\":2,\\\\\\"closed\\\\\\":-1,\\\\\\"used\\\\\\":1716305887610,\\\\\\"created\\\\\\":1716305887610,\\\\\\"remoteIdentityKey\\\\\\":\\\\\\"BU9mZD4VF+v6YOzcjCcrh85PRELV/kQ1nJeXA0ec2Z4C\\\\\\"},\\\\\\"_chains\\\\\\":{\\\\\\"Bbp/5wYXbYqUEYcUsDsEECl5DPuV16j/IJYA3wMqOQAp\\\\\\":{\\\\\\"chainKey\\\\\\":{\\\\\\"counter\\\\\\":8,\\\\\\"key\\\\\\":\\\\\\"p/qsxwyir+OhftJHHL/NEWWTjGvXHTX2ZVB0cQ9SMt8=\\\\\\"},\\\\\\"chainType\\\\\\":2,\\\\\\"messageKeys\\\\\\":{}},\\\\\\"BbXZQ6juzxUgh77KAA2JyL+iZVs6yY7kWAUAVhLkKR1o\\\\\\":{\\\\\\"chainKey\\\\\\":{\\\\\\"counter\\\\\\":-1,\\\\\\"key\\\\\\":\\\\\\"Qtvdye7hxwresW92Cr2u0FuE512Rdkk8QI1mQicvhks=\\\\\\"},\\\\\\"chainType\\\\\\":1,\\\\\\"messageKeys\\\\\\":{}}}}},\\\\\\"version\\\\\\":\\\\\\"v1\\\\\\"}\\""
creds	"\\"{\\\\\\"noiseKey\\\\\\":{\\\\\\"private\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"mEDIcs0kfBcRJVE5+se6P3n5ER2tQ7ilYu48duPK2Ec=\\\\\\"},\\\\\\"public\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"q0aLAnpoT7oGLDDPinZsHus3pn7z2aZXBGZWoMe+u1M=\\\\\\"}},\\\\\\"pairingEphemeralKeyPair\\\\\\":{\\\\\\"private\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"EGxv6kY8T0fjub2txCRB38jabaUjEt6DXqsdsEnrQUc=\\\\\\"},\\\\\\"public\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"e38EyFxGYSL41I+Ev9D/yE+MBld7FVlcyqNYv0e3VlY=\\\\\\"}},\\\\\\"signedIdentityKey\\\\\\":{\\\\\\"private\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"8Ik66/Gd/jZ79EEtCuydbPbw5cx58XFfojdKrFudgVY=\\\\\\"},\\\\\\"public\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"2stYiSkhwoVSd0nwn6z4iGiYD88vFPatOnw4Gzzrh2E=\\\\\\"}},\\\\\\"signedPreKey\\\\\\":{\\\\\\"keyPair\\\\\\":{\\\\\\"private\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"aH8LCSoahJgpBb+fxLrXfeSOy7et4HV8h3OTYMYhoXI=\\\\\\"},\\\\\\"public\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"3220lc8xDUT0HLThNaOy+nHb4+TCn2xWHCJUqoAilmM=\\\\\\"}},\\\\\\"signature\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"uJEiCp7YXMjF5Qo/sBnDB6EnzKJ5VerIFm/0Td/i6eue/tRhCe81wkcWELNYYeuE+9Ov+Wbll9y6YDdivllpgg==\\\\\\"},\\\\\\"keyId\\\\\\":1},\\\\\\"registrationId\\\\\\":8,\\\\\\"advSecretKey\\\\\\":\\\\\\"KzC+SA4UUfEVh76RIdn/OwjRaI4mR+MKNO2Y7Stq650=\\\\\\",\\\\\\"processedHistoryMessages\\\\\\":[{\\\\\\"key\\\\\\":{\\\\\\"remoteJid\\\\\\":\\\\\\"16477996282@s.whatsapp.net\\\\\\",\\\\\\"fromMe\\\\\\":true,\\\\\\"id\\\\\\":\\\\\\"160CAFCBB299683F98F2FDBE93CC7DD2\\\\\\"},\\\\\\"messageTimestamp\\\\\\":1716305888},{\\\\\\"key\\\\\\":{\\\\\\"remoteJid\\\\\\":\\\\\\"16477996282@s.whatsapp.net\\\\\\",\\\\\\"fromMe\\\\\\":true,\\\\\\"id\\\\\\":\\\\\\"48064496F154F7B6665F22DEEC3B6D2E\\\\\\"},\\\\\\"messageTimestamp\\\\\\":1716305888},{\\\\\\"key\\\\\\":{\\\\\\"remoteJid\\\\\\":\\\\\\"16477996282@s.whatsapp.net\\\\\\",\\\\\\"fromMe\\\\\\":true,\\\\\\"id\\\\\\":\\\\\\"B38D36E44ADF341723AE9DB04BCAC473\\\\\\"},\\\\\\"messageTimestamp\\\\\\":1716305891},{\\\\\\"key\\\\\\":{\\\\\\"remoteJid\\\\\\":\\\\\\"16477996282@s.whatsapp.net\\\\\\",\\\\\\"fromMe\\\\\\":true,\\\\\\"id\\\\\\":\\\\\\"8620A3874F5070D9E695E89570D4E0CE\\\\\\"},\\\\\\"messageTimestamp\\\\\\":1716305891},{\\\\\\"key\\\\\\":{\\\\\\"remoteJid\\\\\\":\\\\\\"16477996282@s.whatsapp.net\\\\\\",\\\\\\"fromMe\\\\\\":true,\\\\\\"id\\\\\\":\\\\\\"EB930D260271999FE4F1782B5CBFDD20\\\\\\"},\\\\\\"messageTimestamp\\\\\\":1716305891}],\\\\\\"nextPreKeyId\\\\\\":31,\\\\\\"firstUnuploadedPreKeyId\\\\\\":31,\\\\\\"accountSyncCounter\\\\\\":1,\\\\\\"accountSettings\\\\\\":{\\\\\\"unarchiveChats\\\\\\":false},\\\\\\"deviceId\\\\\\":\\\\\\"LeRQdefyQIqz84HkDf9vNA\\\\\\",\\\\\\"phoneId\\\\\\":\\\\\\"b7f391c6-395e-4b73-bdd9-0b507585ef40\\\\\\",\\\\\\"identityId\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"J87Q1HBhTqsKQeLIe+YQqEqlsRU=\\\\\\"},\\\\\\"registered\\\\\\":false,\\\\\\"backupToken\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"v+kX2t6SlwDcrUy909bEE4yl5ww=\\\\\\"},\\\\\\"registration\\\\\\":{},\\\\\\"account\\\\\\":{\\\\\\"details\\\\\\":\\\\\\"CPzLjioQ3v+ysgYYASAAKAA=\\\\\\",\\\\\\"accountSignatureKey\\\\\\":\\\\\\"T2ZkPhUX6/pg7NyMJyuHzk9EQtX+RDWcl5cDR5zZngI=\\\\\\",\\\\\\"accountSignature\\\\\\":\\\\\\"+ETZCOlYEXHDC4uZq/fYGnXglCL4W+eN3BJHNyrK2eNjj+EpuoLXQ6OrUOQXzT8RxCO7uZLd4Kl0tXf5cDxVCw==\\\\\\",\\\\\\"deviceSignature\\\\\\":\\\\\\"6qSi9SwpJXoYbRS6z6zWP5G34JseLAxNYVxIQ/N3Jt8pBcjiSelku8OBd0jJooyITPnkvhJI29ZHlpLJf20Mhw==\\\\\\"},\\\\\\"me\\\\\\":{\\\\\\"id\\\\\\":\\\\\\"16477996282:34@s.whatsapp.net\\\\\\",\\\\\\"name\\\\\\":\\\\\\"NTR 🤖\\\\\\",\\\\\\"lid\\\\\\":\\\\\\"26070904496338:34@lid\\\\\\"},\\\\\\"signalIdentities\\\\\\":[{\\\\\\"identifier\\\\\\":{\\\\\\"name\\\\\\":\\\\\\"16477996282:34@s.whatsapp.net\\\\\\",\\\\\\"deviceId\\\\\\":0},\\\\\\"identifierKey\\\\\\":{\\\\\\"type\\\\\\":\\\\\\"Buffer\\\\\\",\\\\\\"data\\\\\\":\\\\\\"BU9mZD4VF+v6YOzcjCcrh85PRELV/kQ1nJeXA0ec2Z4C\\\\\\"}}],\\\\\\"platform\\\\\\":\\\\\\"android\\\\\\",\\\\\\"lastAccountSyncTimestamp\\\\\\":1716305929,\\\\\\"myAppStateKeyId\\\\\\":\\\\\\"AAAAAL8H\\\\\\"}\\""
\.


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE SET; Schema: drizzle; Owner: postgres
--

SELECT pg_catalog.setval('drizzle.__drizzle_migrations_id_seq', 36, true);


--
-- Name: bookings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bookings_id_seq', 16, true);


--
-- Name: players_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.players_id_seq', 55, true);


--
-- Name: players_to_skates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.players_to_skates_id_seq', 769, true);


--
-- Name: skates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.skates_id_seq', 56, true);


--
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: postgres
--

ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);


--
-- Name: bookings bookings_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_id_unique PRIMARY KEY (id);


--
-- Name: bookings bookings_name_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_name_unique UNIQUE (name);


--
-- Name: players players_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_email_unique UNIQUE (email);


--
-- Name: players players_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_id_unique PRIMARY KEY (id);


--
-- Name: players players_phone_number_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_phone_number_unique UNIQUE (phone_number);


--
-- Name: players_to_bookings players_to_bookings_player_id_booking_id_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players_to_bookings
    ADD CONSTRAINT players_to_bookings_player_id_booking_id_pk PRIMARY KEY (player_id, booking_id);


--
-- Name: players_to_skates players_to_skates_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players_to_skates
    ADD CONSTRAINT players_to_skates_id_unique UNIQUE (id);


--
-- Name: skates skates_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skates
    ADD CONSTRAINT skates_id_unique PRIMARY KEY (id);


--
-- Name: whatsapp_auth whatsapp_auth_key_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.whatsapp_auth
    ADD CONSTRAINT whatsapp_auth_key_unique PRIMARY KEY (key);


--
-- Name: players_clerk_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX players_clerk_user_id_idx ON public.players USING btree (clerk_user_id);


--
-- Name: players_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX players_email_idx ON public.players USING btree (email);


--
-- Name: players_phone_number_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX players_phone_number_idx ON public.players USING btree (phone_number);


--
-- Name: whatsapp_auth_key_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX whatsapp_auth_key_idx ON public.whatsapp_auth USING btree (key);


--
-- Name: bookings bookings_booked_by_id_players_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booked_by_id_players_id_fk FOREIGN KEY (booked_by_id) REFERENCES public.players(id);


--
-- Name: players_to_bookings players_to_bookings_booking_id_bookings_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players_to_bookings
    ADD CONSTRAINT players_to_bookings_booking_id_bookings_id_fk FOREIGN KEY (booking_id) REFERENCES public.bookings(id);


--
-- Name: players_to_bookings players_to_bookings_player_id_players_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players_to_bookings
    ADD CONSTRAINT players_to_bookings_player_id_players_id_fk FOREIGN KEY (player_id) REFERENCES public.players(id);


--
-- Name: players_to_skates players_to_skates_player_id_players_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players_to_skates
    ADD CONSTRAINT players_to_skates_player_id_players_id_fk FOREIGN KEY (player_id) REFERENCES public.players(id) ON DELETE CASCADE;


--
-- Name: players_to_skates players_to_skates_skate_id_skates_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players_to_skates
    ADD CONSTRAINT players_to_skates_skate_id_skates_id_fk FOREIGN KEY (skate_id) REFERENCES public.skates(id) ON DELETE CASCADE;


--
-- Name: players_to_skates players_to_skates_substitute_player_id_players_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players_to_skates
    ADD CONSTRAINT players_to_skates_substitute_player_id_players_id_fk FOREIGN KEY (substitute_player_id) REFERENCES public.players(id);


--
-- Name: skates skates_booking_id_bookings_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skates
    ADD CONSTRAINT skates_booking_id_bookings_id_fk FOREIGN KEY (booking_id) REFERENCES public.bookings(id);


--
-- PostgreSQL database dump complete
--

