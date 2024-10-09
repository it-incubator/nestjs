
-- CREATE TABLE measurement (
--     city_id         int not null,
--     logdate         date not null,
--     peaktemp        int,
--     unitsales       int
-- ) PARTITION BY RANGE (logdate);

-- CREATE TABLESPACE fasttablespace
--     OWNER dimych1
--     LOCATION '/mnt/fast_storage';

-- CREATE TABLE measurement_y2007m11 PARTITION OF measurement
--     FOR VALUES FROM ('2007-11-01') TO ('2007-12-01');

-- CREATE TABLE measurement_y2007m12 PARTITION OF measurement
--     FOR VALUES FROM ('2007-12-01') TO ('2008-01-01')
--     TABLESPACE fasttablespace;

-- CREATE TABLE measurement_y2008m01 PARTITION OF measurement
--     FOR VALUES FROM ('2008-01-01') TO ('2008-02-01')
--     WITH (parallel_workers = 4)
--     TABLESPACE fasttablespace;

-- Вставка в партицию measurement_y2007m11
INSERT INTO measurement (city_id, logdate, peaktemp, unitsales)
VALUES
(101, '2007-11-15', 23, 150),
(102, '2007-11-20', 25, 200);

-- Вставка в партицию measurement_y2007m12
INSERT INTO measurement (city_id, logdate, peaktemp, unitsales)
VALUES
(201, '2007-12-10', 20, 180),
(202, '2007-12-25', 22, 220);

-- Вставка в партицию measurement_y2008m01
INSERT INTO measurement (city_id, logdate, peaktemp, unitsales)
VALUES
(301, '2008-01-05', 19, 160),
(302, '2008-01-20', 21, 190);








CREATE SERVER news_1_server
FOREIGN DATA WRAPPER postgres_fdw
OPTIONS (host '127.0.0.1', port '5442', dbname 'db2');


CREATE USER MAPPING FOR dimych1
SERVER news_1_server
OPTIONS (user 'dimych2' , password 'it-incubator.io');




CREATE SERVER news_1_server
FOREIGN DATA WRAPPER postgres_fdw
OPTIONS (host 'postgres_instance2', port '5432', dbname 'db2');


CREATE USER MAPPING FOR dimych1
SERVER news_1_server
OPTIONS (user 'dimych2' , password 'it-incubator.io');

CREATE FOREIGN TABLE measurement_1 (
city_id         int not null,
logdate         date not null,
peaktemp        int,
unitsales       int
)
SERVER news_1_server
OPTIONS (schema_name 'public', table_name 'measurement')


CREATE VIEW alldata AS
SELECT * FROM measurement
UNION ALL
SELECT * FROM measurement_1


select * from alldata


CREATE RULE news_insert AS ON INSERT TO alldata
DO INSTEAD NOTHING;
CREATE RULE news_update AS ON UPDATE TO alldata
DO INSTEAD NOTHING;
CREATE RULE news_delete AS ON DELETE TO alldata
DO INSTEAD NOTHING;

CREATE RULE news_insert_to_1 AS ON INSERT TO alldata
WHERE ( logdate BETWEEN '2007-11-01' and '2008-02-01')
DO INSTEAD INSERT INTO measurement VALUES (NEW.*);
CREATE RULE news_insert_to_2 AS ON INSERT TO alldata
WHERE ( logdate BETWEEN '2008-02-01' and '2025-01-01')
DO INSTEAD INSERT INTO measurement_1 VALUES (NEW. *);



INSERT INTO alldata (city_id, logdate, peaktemp, unitsales)
VALUES
(301, '2015-01-05', 19, 160),
(302, '2020-01-20', 21, 190);


