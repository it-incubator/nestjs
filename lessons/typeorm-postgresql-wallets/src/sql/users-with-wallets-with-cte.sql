WITH
	"paginated_users" AS (
		SELECT
			"u"."id" AS "paginatedUserId"
		FROM
			"user" "u"
		ORDER BY
			"u"."lastName" ASC
		LIMIT
			10
	)
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
	"u"."id" IN (
		SELECT
			"paginatedUserId"
		FROM
			"paginated_users"
	)


	---------------
-- некорретное кол-во записей, здесь вообще не нужны WITH
WITH
	"paginated_users" AS (
		SELECT
			"u"."id" AS "paginatedUserId"
		FROM
			"user" "u"
		ORDER BY
			"u"."lastName" ASC
		LIMIT
			10
	)
SELECT
	COUNT(DISTINCT ("u"."id")) AS "cnt"
FROM
	"user" "u"
	LEFT JOIN "wallet" "w" ON "w"."ownerId" = "u"."id"
WHERE
	"u"."id" IN (
		SELECT
			"paginatedUserId"
		FROM
			"paginated_users"
	)
