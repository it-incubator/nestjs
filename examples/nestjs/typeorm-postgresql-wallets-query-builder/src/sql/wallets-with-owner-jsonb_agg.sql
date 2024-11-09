SELECT
	U.*,
	JSONB_AGG(
		JSON_BUILD_OBJECT(
			'balance',
			"w"."balance",
			'currency',
			"w"."currency"
		)
	) AS OWNER
FROM
	"user" "u"
	LEFT JOIN "wallet" "w" ON "w"."ownerId" = "u"."id"
GROUP BY
	"u"."id"