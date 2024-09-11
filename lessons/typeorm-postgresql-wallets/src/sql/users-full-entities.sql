 SELECT
     "u"."id" AS "u_id", -- typeorm добавляет префикс u_ чтобы потом ему легче было распарсить это в сущности
     "u"."firstName" AS "u_firstName",
     "u"."lastName" AS "u_lastName",
     "u"."passportNumber" AS "u_passportNumber",
     "u"."isMarried" AS "u_isMarried"
 FROM
 "user" "u"
 LIMIT
 10;

------------------

SELECT
COUNT(1) AS "cnt" --COUNT(1) тоже самое что COUNT(*)
FROM
"user" "u";