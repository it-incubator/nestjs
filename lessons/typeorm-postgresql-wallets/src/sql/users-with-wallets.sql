SELECT DISTINCT
	"distinctAlias"."u_id" AS "ids_u_id"
FROM
	(
		SELECT
			"u"."id" AS "u_id",
			"u"."firstName" AS "u_firstName",
			"u"."lastName" AS "u_lastName",
			"u"."passportNumber" AS "u_passportNumber",
			"u"."isMarried" AS "u_isMarried",
			"w"."id" AS "w_id",
			"w"."title" AS "w_title",
			"w"."currency" AS "w_currency",
			"w"."balance" AS "w_balance",
			"w"."ownerId" AS "w_ownerId"
		FROM
			"user" "u"
			LEFT JOIN "wallet" "w" ON "w"."ownerId" = "u"."id"
	) "distinctAlias"
ORDER BY
	"u_id" ASC
LIMIT
	10


	--------------


	SELECT
    	"u"."id" AS "u_id",
    	"u"."firstName" AS "u_firstName",
    	"u"."lastName" AS "u_lastName",
    	"u"."passportNumber" AS "u_passportNumber",
    	"u"."isMarried" AS "u_isMarried",
    	"w"."id" AS "w_id",
    	"w"."title" AS "w_title",
    	"w"."currency" AS "w_currency",
    	"w"."balance" AS "w_balance",
    	"w"."ownerId" AS "w_ownerId"
    FROM
    	"user" "u"
    	LEFT JOIN "wallet" "w" ON "w"."ownerId" = "u"."id"
    WHERE
    	"u"."id" IN (31, 32, 33, 34, 35, 36, 37, 38, 39, 40)



    	---------------


------ LIMIT / OFFSET

SELECT
	"u"."id" AS "u_id",
	"u"."firstName" AS "u_firstName",
	"u"."lastName" AS "u_lastName",
	"u"."passportNumber" AS "u_passportNumber",
	"u"."isMarried" AS "u_isMarried",
	"w"."id" AS "w_id",
	"w"."title" AS "w_title",
	"w"."currency" AS "w_currency",
	"w"."balance" AS "w_balance",
	"w"."ownerId" AS "w_ownerId"
FROM
	"user" "u"
	LEFT JOIN "wallet" "w" ON "w"."ownerId" = "u"."id"
LIMIT
	10


	---------

	SELECT COUNT(DISTINCT("u"."id")) AS "cnt" FROM "user" "u" LEFT JOIN "wallet" "w" ON "w"."ownerId"="u"."id"
