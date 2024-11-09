SELECT
	"u"."id" AS "u_id",
	"u"."firstName" AS "u_firstName",
	"u"."lastName" AS "u_lastName"
FROM
	"user" "u"
LIMIT
	10;

-----------

SELECT
	COUNT(1) AS "cnt"
FROM
	"user" "u";