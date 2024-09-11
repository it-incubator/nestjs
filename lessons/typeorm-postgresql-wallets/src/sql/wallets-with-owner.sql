SELECT
	"w"."id" AS "w_id",
	"w"."title" AS "w_title",
	"w"."currency" AS "w_currency",
	"w"."balance" AS "w_balance",
	"w"."ownerId" AS "w_ownerId",
	"u"."id" AS "u_id",
	"u"."firstName" AS "u_firstName",
	"u"."lastName" AS "u_lastName",
	"u"."passportNumber" AS "u_passportNumber",
	"u"."isMarried" AS "u_isMarried"
FROM
	"wallet" "w"
	LEFT JOIN "user" "u" ON "u"."id" = "w"."ownerId"