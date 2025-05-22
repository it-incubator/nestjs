# Use the official MongoDB image
FROM mongo:7

# Copy key file into the container
COPY mongo-keyfile /data/mongo-keyfile

# Set correct permissions for the key file
RUN chmod 600 /data/mongo-keyfile && chown mongodb:mongodb /data/mongo-keyfile
