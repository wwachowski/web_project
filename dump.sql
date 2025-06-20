PGDMP                      }           tournaments    16.2    16.2 7    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16493    tournaments    DATABASE     �   CREATE DATABASE tournaments WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United Kingdom.1252';
    DROP DATABASE tournaments;
                postgres    false                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
                pg_database_owner    false            �           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                   pg_database_owner    false    4            �            1259    16598    matches    TABLE       CREATE TABLE public.matches (
    id integer NOT NULL,
    tournament_id integer NOT NULL,
    player1_id integer,
    player2_id integer,
    player1_winner_pick_id integer,
    player2_winner_pick_id integer,
    winner_id integer,
    round integer NOT NULL
);
    DROP TABLE public.matches;
       public         heap    postgres    false    4            �            1259    16597    matches_id_seq    SEQUENCE     �   CREATE SEQUENCE public.matches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.matches_id_seq;
       public          postgres    false    224    4            �           0    0    matches_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.matches_id_seq OWNED BY public.matches.id;
          public          postgres    false    223            �            1259    16524    sponsor_logos    TABLE     z   CREATE TABLE public.sponsor_logos (
    id integer NOT NULL,
    tournament_id integer NOT NULL,
    url text NOT NULL
);
 !   DROP TABLE public.sponsor_logos;
       public         heap    postgres    false    4            �            1259    16523    sponsor_logos_id_seq    SEQUENCE     �   CREATE SEQUENCE public.sponsor_logos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.sponsor_logos_id_seq;
       public          postgres    false    220    4            �           0    0    sponsor_logos_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.sponsor_logos_id_seq OWNED BY public.sponsor_logos.id;
          public          postgres    false    219            �            1259    16538    tournament_participants    TABLE     �   CREATE TABLE public.tournament_participants (
    id integer NOT NULL,
    tournament_id integer NOT NULL,
    user_id integer NOT NULL,
    license_number character varying(50) NOT NULL,
    ranking integer NOT NULL
);
 +   DROP TABLE public.tournament_participants;
       public         heap    postgres    false    4            �            1259    16537    tournament_participants_id_seq    SEQUENCE     �   CREATE SEQUENCE public.tournament_participants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public.tournament_participants_id_seq;
       public          postgres    false    4    222            �           0    0    tournament_participants_id_seq    SEQUENCE OWNED BY     a   ALTER SEQUENCE public.tournament_participants_id_seq OWNED BY public.tournament_participants.id;
          public          postgres    false    221            �            1259    16508    tournaments    TABLE     	  CREATE TABLE public.tournaments (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    discipline character varying(100) NOT NULL,
    organizer_id integer NOT NULL,
    start_time timestamp without time zone NOT NULL,
    location text NOT NULL,
    max_participants integer NOT NULL,
    application_deadline timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tournaments_max_participants_check CHECK ((max_participants > 0))
);
    DROP TABLE public.tournaments;
       public         heap    postgres    false    4            �            1259    16507    tournaments_id_seq    SEQUENCE     �   CREATE SEQUENCE public.tournaments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.tournaments_id_seq;
       public          postgres    false    4    218            �           0    0    tournaments_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.tournaments_id_seq OWNED BY public.tournaments.id;
          public          postgres    false    217            �            1259    16495    users    TABLE       CREATE TABLE public.users (
    id integer NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash text NOT NULL,
    is_active boolean DEFAULT false,
    activation_token character varying(255),
    activation_expires_at timestamp without time zone,
    password_reset_token character varying(255),
    password_reset_expires_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.users;
       public         heap    postgres    false    4            �            1259    16494    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    216    4            �           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    215            5           2604    16601 
   matches id    DEFAULT     h   ALTER TABLE ONLY public.matches ALTER COLUMN id SET DEFAULT nextval('public.matches_id_seq'::regclass);
 9   ALTER TABLE public.matches ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    223    224    224            3           2604    16527    sponsor_logos id    DEFAULT     t   ALTER TABLE ONLY public.sponsor_logos ALTER COLUMN id SET DEFAULT nextval('public.sponsor_logos_id_seq'::regclass);
 ?   ALTER TABLE public.sponsor_logos ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    219    220    220            4           2604    16541    tournament_participants id    DEFAULT     �   ALTER TABLE ONLY public.tournament_participants ALTER COLUMN id SET DEFAULT nextval('public.tournament_participants_id_seq'::regclass);
 I   ALTER TABLE public.tournament_participants ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    221    222    222            1           2604    16511    tournaments id    DEFAULT     p   ALTER TABLE ONLY public.tournaments ALTER COLUMN id SET DEFAULT nextval('public.tournaments_id_seq'::regclass);
 =   ALTER TABLE public.tournaments ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    218    217    218            .           2604    16498    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    215    216            �          0    16598    matches 
   TABLE DATA           �   COPY public.matches (id, tournament_id, player1_id, player2_id, player1_winner_pick_id, player2_winner_pick_id, winner_id, round) FROM stdin;
    public          postgres    false    224   WH       �          0    16524    sponsor_logos 
   TABLE DATA           ?   COPY public.sponsor_logos (id, tournament_id, url) FROM stdin;
    public          postgres    false    220   �H       �          0    16538    tournament_participants 
   TABLE DATA           f   COPY public.tournament_participants (id, tournament_id, user_id, license_number, ranking) FROM stdin;
    public          postgres    false    222   I       �          0    16508    tournaments 
   TABLE DATA           �   COPY public.tournaments (id, name, discipline, organizer_id, start_time, location, max_participants, application_deadline, created_at) FROM stdin;
    public          postgres    false    218   OI       �          0    16495    users 
   TABLE DATA           �   COPY public.users (id, first_name, last_name, email, password_hash, is_active, activation_token, activation_expires_at, password_reset_token, password_reset_expires_at, created_at) FROM stdin;
    public          postgres    false    216   �J       �           0    0    matches_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.matches_id_seq', 3, true);
          public          postgres    false    223            �           0    0    sponsor_logos_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.sponsor_logos_id_seq', 21, true);
          public          postgres    false    219            �           0    0    tournament_participants_id_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public.tournament_participants_id_seq', 5, true);
          public          postgres    false    221            �           0    0    tournaments_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.tournaments_id_seq', 7, true);
          public          postgres    false    217            �           0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 7, true);
          public          postgres    false    215            H           2606    16603    matches matches_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.matches DROP CONSTRAINT matches_pkey;
       public            postgres    false    224            >           2606    16531     sponsor_logos sponsor_logos_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.sponsor_logos
    ADD CONSTRAINT sponsor_logos_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.sponsor_logos DROP CONSTRAINT sponsor_logos_pkey;
       public            postgres    false    220            @           2606    16545 B   tournament_participants tournament_participants_license_number_key 
   CONSTRAINT     �   ALTER TABLE ONLY public.tournament_participants
    ADD CONSTRAINT tournament_participants_license_number_key UNIQUE (license_number);
 l   ALTER TABLE ONLY public.tournament_participants DROP CONSTRAINT tournament_participants_license_number_key;
       public            postgres    false    222            B           2606    16543 4   tournament_participants tournament_participants_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY public.tournament_participants
    ADD CONSTRAINT tournament_participants_pkey PRIMARY KEY (id);
 ^   ALTER TABLE ONLY public.tournament_participants DROP CONSTRAINT tournament_participants_pkey;
       public            postgres    false    222            D           2606    16549 I   tournament_participants tournament_participants_tournament_id_ranking_key 
   CONSTRAINT     �   ALTER TABLE ONLY public.tournament_participants
    ADD CONSTRAINT tournament_participants_tournament_id_ranking_key UNIQUE (tournament_id, ranking);
 s   ALTER TABLE ONLY public.tournament_participants DROP CONSTRAINT tournament_participants_tournament_id_ranking_key;
       public            postgres    false    222    222            F           2606    16547 I   tournament_participants tournament_participants_tournament_id_user_id_key 
   CONSTRAINT     �   ALTER TABLE ONLY public.tournament_participants
    ADD CONSTRAINT tournament_participants_tournament_id_user_id_key UNIQUE (tournament_id, user_id);
 s   ALTER TABLE ONLY public.tournament_participants DROP CONSTRAINT tournament_participants_tournament_id_user_id_key;
       public            postgres    false    222    222            <           2606    16517    tournaments tournaments_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.tournaments
    ADD CONSTRAINT tournaments_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.tournaments DROP CONSTRAINT tournaments_pkey;
       public            postgres    false    218            8           2606    16506    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public            postgres    false    216            :           2606    16504    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    216            M           2606    16609    matches matches_player1_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_player1_id_fkey FOREIGN KEY (player1_id) REFERENCES public.tournament_participants(id);
 I   ALTER TABLE ONLY public.matches DROP CONSTRAINT matches_player1_id_fkey;
       public          postgres    false    224    222    4674            N           2606    16619 +   matches matches_player1_winner_pick_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_player1_winner_pick_id_fkey FOREIGN KEY (player1_winner_pick_id) REFERENCES public.tournament_participants(id);
 U   ALTER TABLE ONLY public.matches DROP CONSTRAINT matches_player1_winner_pick_id_fkey;
       public          postgres    false    222    4674    224            O           2606    16614    matches matches_player2_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_player2_id_fkey FOREIGN KEY (player2_id) REFERENCES public.tournament_participants(id);
 I   ALTER TABLE ONLY public.matches DROP CONSTRAINT matches_player2_id_fkey;
       public          postgres    false    224    222    4674            P           2606    16624 +   matches matches_player2_winner_pick_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_player2_winner_pick_id_fkey FOREIGN KEY (player2_winner_pick_id) REFERENCES public.tournament_participants(id);
 U   ALTER TABLE ONLY public.matches DROP CONSTRAINT matches_player2_winner_pick_id_fkey;
       public          postgres    false    4674    224    222            Q           2606    16604 "   matches matches_tournament_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_tournament_id_fkey FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id) ON DELETE CASCADE;
 L   ALTER TABLE ONLY public.matches DROP CONSTRAINT matches_tournament_id_fkey;
       public          postgres    false    224    4668    218            R           2606    16629    matches matches_winner_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_winner_id_fkey FOREIGN KEY (winner_id) REFERENCES public.tournament_participants(id);
 H   ALTER TABLE ONLY public.matches DROP CONSTRAINT matches_winner_id_fkey;
       public          postgres    false    222    4674    224            J           2606    16532 .   sponsor_logos sponsor_logos_tournament_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.sponsor_logos
    ADD CONSTRAINT sponsor_logos_tournament_id_fkey FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id) ON DELETE CASCADE;
 X   ALTER TABLE ONLY public.sponsor_logos DROP CONSTRAINT sponsor_logos_tournament_id_fkey;
       public          postgres    false    218    4668    220            K           2606    16550 B   tournament_participants tournament_participants_tournament_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.tournament_participants
    ADD CONSTRAINT tournament_participants_tournament_id_fkey FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id) ON DELETE CASCADE;
 l   ALTER TABLE ONLY public.tournament_participants DROP CONSTRAINT tournament_participants_tournament_id_fkey;
       public          postgres    false    222    218    4668            L           2606    16555 <   tournament_participants tournament_participants_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.tournament_participants
    ADD CONSTRAINT tournament_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 f   ALTER TABLE ONLY public.tournament_participants DROP CONSTRAINT tournament_participants_user_id_fkey;
       public          postgres    false    216    222    4666            I           2606    16518 )   tournaments tournaments_organizer_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.tournaments
    ADD CONSTRAINT tournaments_organizer_id_fkey FOREIGN KEY (organizer_id) REFERENCES public.users(id) ON DELETE CASCADE;
 S   ALTER TABLE ONLY public.tournaments DROP CONSTRAINT tournaments_organizer_id_fkey;
       public          postgres    false    218    216    4666            �   -   x�3�4�4�4b4�2�9!$��Ц�1~@
Hq��qqq ��;      �   _   x���;
�0 й9L�~�,.R�
�	�����t<o�Y[�:�s.�F)�e��/>�{���I��"��z�U�Tr����'	7���Y&�a�A{      �   <   x�3�4�4�tv�4�2�M9#""8M�L�lsβ��2Ns.S ǌ����͏Ӓ+F��� �	�      �   (  x��QAn�0<�_��Ȼ�c��R+!�"q��ȑ
J^_��¡������,�����xF�(}Q�#�?ZT� 	$HE"��p��2���:o���U����!G̤��:5,�yuiF�ᣳ����#e�4H�֝[�Η͡���g<�Ǥ��T3�zM=^�t�����[���'�=��XKb)��6��X���з9���4h(���b��I��m6o��x�1�tM1��P}®��%��7��=ؼ���!Ȼs�
V�:+[7���	��S�_�?����-"�����1c�ށ�1      �   n  x�ՓMO�0��ί�Ы��x���vT,�$���q�MK�P��_O���#\٣�߃��ck����&��]��cS�u�/f����H����#�4_?M��H?/���z>���w:�Y<���3Z���zrbu�.�-Y��T�&N@��R*n4��J��Ps0\�$��WNhk��y?���U]f�a�m����Ąe?���{~�M����e��nB�kW9[m6V�k 7��C=�
'!�.(n��8�$y�����dCЈw� yD��} �Ι�ب}d��.��_�����T�ȓ9�L����w�o6o`xߗ�X�>`P�1�S�u^E���F�y��\�aG��"�s��o��.�Y�� vh(�     