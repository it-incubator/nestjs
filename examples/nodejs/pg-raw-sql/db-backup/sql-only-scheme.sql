--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3 (Debian 16.3-1.pgdg120+1)
-- Dumped by pg_dump version 16.1

-- Started on 2024-08-16 18:16:20 +04

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
-- TOC entry 2 (class 3079 OID 16570)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 3409 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 216 (class 1259 OID 16581)
-- Name: Profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Profiles" (
    "Hobby" character varying,
    "Education" character varying,
    "UserId" integer NOT NULL
);


ALTER TABLE public."Profiles" OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16586)
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    "Id" integer NOT NULL,
    "FirstName" character varying,
    "LastName" character varying,
    "PassportNumber" character varying,
    "IsMarried" boolean
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16591)
-- Name: Wallets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Wallets" (
    "Id" uuid DEFAULT public.uuid_generate_v1() NOT NULL,
    "Title" character varying,
    "Currency" character(3),
    "OwnerId" integer
);


ALTER TABLE public."Wallets" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16597)
-- Name: UsersWithWalletsCount; Type: MATERIALIZED VIEW; Schema: public; Owner: postgres
--

CREATE MATERIALIZED VIEW public."UsersWithWalletsCount"
WITH (autovacuum_enabled='true') AS
 SELECT "Id",
    "FirstName",
    "LastName",
    "PassportNumber",
    "IsMarried",
    ( SELECT count(*) AS count
           FROM public."Wallets"
          WHERE ("Wallets"."OwnerId" = u."Id")) AS "WalletCount"
   FROM public."Users" u
  WITH NO DATA;


ALTER MATERIALIZED VIEW public."UsersWithWalletsCount" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16603)
-- Name: UsersWithWalletsVountView; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public."UsersWithWalletsVountView" AS
 SELECT "Id",
    "FirstName",
    "LastName",
    "PassportNumber",
    "IsMarried",
    ( SELECT count(*) AS count
           FROM public."Wallets"
          WHERE ("Wallets"."OwnerId" = u."Id")) AS "WalletCount"
   FROM public."Users" u;


ALTER VIEW public."UsersWithWalletsVountView" OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16607)
-- Name: Users_Id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Users_Id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Users_Id_seq" OWNER TO postgres;

--
-- TOC entry 3410 (class 0 OID 0)
-- Dependencies: 221
-- Name: Users_Id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Users_Id_seq" OWNED BY public."Users"."Id";


--
-- TOC entry 222 (class 1259 OID 16608)
-- Name: WalletsSharings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."WalletsSharings" (
    "Id" uuid DEFAULT public.uuid_generate_v1() NOT NULL,
    "WalletId" uuid,
    "UserId" integer,
    "AddedDate" date DEFAULT CURRENT_DATE,
    "Status" smallint
);


ALTER TABLE public."WalletsSharings" OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16613)
-- Name: WalletsSharingsLimits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."WalletsSharingsLimits" (
    "WalletSharingId" uuid NOT NULL,
    "LimitPerDay" integer,
    "LimitPerWeek" integer,
    "LimitPerMonth" integer
);


ALTER TABLE public."WalletsSharingsLimits" OWNER TO postgres;

--
-- TOC entry 3238 (class 2604 OID 16616)
-- Name: Users Id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users" ALTER COLUMN "Id" SET DEFAULT nextval('public."Users_Id_seq"'::regclass);


--
-- TOC entry 3243 (class 2606 OID 16618)
-- Name: Profiles Profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Profiles"
    ADD CONSTRAINT "Profiles_pkey" PRIMARY KEY ("UserId");


--
-- TOC entry 3245 (class 2606 OID 16620)
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 3253 (class 2606 OID 16622)
-- Name: WalletsSharingsLimits WalletsSharingsLimits_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WalletsSharingsLimits"
    ADD CONSTRAINT "WalletsSharingsLimits_pkey" PRIMARY KEY ("WalletSharingId");


--
-- TOC entry 3249 (class 2606 OID 16624)
-- Name: WalletsSharings WalletsSharings_WalletId_UserId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WalletsSharings"
    ADD CONSTRAINT "WalletsSharings_WalletId_UserId_key" UNIQUE ("WalletId", "UserId");


--
-- TOC entry 3251 (class 2606 OID 16626)
-- Name: WalletsSharings WalletsSharings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WalletsSharings"
    ADD CONSTRAINT "WalletsSharings_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 3247 (class 2606 OID 16628)
-- Name: Wallets Wallets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Wallets"
    ADD CONSTRAINT "Wallets_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 3254 (class 2606 OID 16629)
-- Name: Profiles Profiles_UserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Profiles"
    ADD CONSTRAINT "Profiles_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES public."Users"("Id");


--
-- TOC entry 3258 (class 2606 OID 16634)
-- Name: WalletsSharingsLimits WalletsSharingsLimits_WalletSharingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WalletsSharingsLimits"
    ADD CONSTRAINT "WalletsSharingsLimits_WalletSharingId_fkey" FOREIGN KEY ("WalletSharingId") REFERENCES public."Wallets"("Id");


--
-- TOC entry 3256 (class 2606 OID 16639)
-- Name: WalletsSharings WalletsSharings_UserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WalletsSharings"
    ADD CONSTRAINT "WalletsSharings_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES public."Users"("Id");


--
-- TOC entry 3257 (class 2606 OID 16644)
-- Name: WalletsSharings WalletsSharings_WalletId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WalletsSharings"
    ADD CONSTRAINT "WalletsSharings_WalletId_fkey" FOREIGN KEY ("WalletId") REFERENCES public."Wallets"("Id");


--
-- TOC entry 3255 (class 2606 OID 16649)
-- Name: Wallets Wallets_OwnerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Wallets"
    ADD CONSTRAINT "Wallets_OwnerId_fkey" FOREIGN KEY ("OwnerId") REFERENCES public."Users"("Id") NOT VALID;


-- Completed on 2024-08-16 18:16:20 +04

--
-- PostgreSQL database dump complete
--

