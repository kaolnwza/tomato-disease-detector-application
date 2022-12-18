package services

import (
	"context"
	"fmt"
	"io"
	"log"
	"tomato-api/apisrv/model"
	"tomato-api/apisrv/repo"

	"net/http"
	"net/url"
	"os"
	"time"

	"cloud.google.com/go/storage"
	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	uuid "github.com/satori/go.uuid"
	"google.golang.org/api/option"
	"google.golang.org/appengine"
)

// func init() {
// 	TestStorage()
// }

func TestStorage() {
	ctx := context.Background()

	// Sets your Google Cloud Platform project ID.
	projectID := os.Getenv("GCS_PROJECT_ID")

	// Creates a client.
	client, err := storage.NewClient(ctx)
	if err != nil {
		log.Fatalf("Failed to create client: %v", err)
	}
	defer client.Close()

	// Sets the name for the new bucket.
	bucketName := os.Getenv("GCS_BUCKET_1")

	// Creates a Bucket instance.
	bucket := client.Bucket(bucketName)

	// Creates the new bucket.
	ctx, cancel := context.WithTimeout(ctx, time.Second*10)
	defer cancel()
	if err := bucket.Create(ctx, projectID, nil); err != nil {
		log.Fatalf("Failed to create bucket: %v", err)
	}

	fmt.Printf("Bucket %v created.\n", bucketName)

}

var (
	storageClient *storage.Client
)

func FileUploadToBucketHandler(c *gin.Context) {
	userUUID, ok := c.Request.Context().Value("access_user_uuid").(uuid.UUID)
	if !ok {
		c.Status(http.StatusInternalServerError)
		c.Abort()
		return
	}

	bucket := os.Getenv("GCS_BUCKET_1")

	var err error

	ctx := appengine.NewContext(c.Request)

	storageClient, err = storage.NewClient(ctx, option.WithCredentialsFile(os.Getenv("GOOGLE_APPLICATION_CREDENTIALS")))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
			"error":   true,
		})
		return
	}

	f, uploadedFile, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
			"error":   true,
		})
		return
	}

	defer f.Close()

	objectLocation := fmt.Sprintf(`image/%s_%s`, uuid.NewV4(), uploadedFile.Filename)

	sw := storageClient.Bucket(bucket).Object(objectLocation).NewWriter(ctx)

	if _, err := io.Copy(sw, f); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
			"error":   true,
		})
		return
	}

	if err := sw.Close(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
			"error":   true,
		})
		return
	}

	u, err := url.Parse(sw.Attrs().Name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
			"Error":   true,
		})
		return
	}

	opts := &storage.SignedURLOptions{
		Scheme:  storage.SigningSchemeV4,
		Method:  "GET",
		Expires: time.Now().Add(15 * time.Minute),
	}

	url, err := storageClient.Bucket(bucket).SignedURL(objectLocation, opts)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
			"Error":   true,
		})
		return
	}

	upload := model.Upload{}
	if err := repo.UploadImage(repo.DB, &upload, u.EscapedPath(), os.Getenv("GCS_BUCKET_1"), userUUID); err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"uri": url,
	})
}

func FileUploadToBucketByImage(c *gin.Context, userUUID uuid.UUID, tx *sqlx.Tx) (*model.Upload, error) {

	bucket := os.Getenv("GCS_BUCKET_1")

	var err error

	ctx := appengine.NewContext(c.Request)

	storageClient, err = storage.NewClient(ctx, option.WithCredentialsFile(os.Getenv("GOOGLE_APPLICATION_CREDENTIALS")))
	if err != nil {
		return nil, err
	}

	f, uploadedFile, err := c.Request.FormFile("file")
	if err != nil {
		return nil, err
	}

	defer f.Close()

	objectLocation := fmt.Sprintf(`image/%s_%s`, uuid.NewV4(), uploadedFile.Filename)

	sw := storageClient.Bucket(bucket).Object(objectLocation).NewWriter(ctx)

	if _, err := io.Copy(sw, f); err != nil {
		return nil, err
	}

	if err := sw.Close(); err != nil {
		return nil, err
	}

	u, err := url.Parse(sw.Attrs().Name)
	if err != nil {
		return nil, err
	}

	// opts := &storage.SignedURLOptions{
	// 	Scheme:  storage.SigningSchemeV4,
	// 	Method:  "GET",
	// 	Expires: time.Now().Add(15 * time.Minute),
	// }

	// url, err := storageClient.Bucket(bucket).SignedURL(objectLocation, opts)
	// if err != nil {
	// 	return err
	// }

	upload := model.Upload{}
	if err := repo.UploadImage(tx, &upload, u.EscapedPath(), os.Getenv("GCS_BUCKET_1"), userUUID); err != nil {
		return nil, err
	}

	return &upload, nil
}

func GenerateImageURI(c *gin.Context, bucket string, objectLocation string) (string, error) {
	ctx := appengine.NewContext(c.Request)

	storageClient, err := storage.NewClient(ctx, option.WithCredentialsFile(os.Getenv("GOOGLE_APPLICATION_CREDENTIALS")))
	if err != nil {
		return "", err
	}

	opts := &storage.SignedURLOptions{
		Scheme:  storage.SigningSchemeV4,
		Method:  "GET",
		Expires: time.Now().Add(15 * time.Minute),
	}

	url, err := storageClient.Bucket(bucket).SignedURL(objectLocation, opts)
	if err != nil {
		return "", err
	}

	return url, nil
}

// func init() {
// 	uploadFile(os.Getenv("GCS_BUCKET_1"))
// }
// uploadFile uploads an object.
func uploadFile(w io.Writer, bucket, object string) error {
	// bucket := "bucket-name"
	// object := "object-name"
	ctx := context.Background()
	client, err := storage.NewClient(ctx)
	if err != nil {
		return fmt.Errorf("storage.NewClient: %v", err)
	}
	defer client.Close()

	// Open local file.
	f, err := os.Open("notes.txt")
	if err != nil {
		return fmt.Errorf("os.Open: %v", err)
	}
	defer f.Close()

	ctx, cancel := context.WithTimeout(ctx, time.Second*50)
	defer cancel()

	o := client.Bucket(bucket).Object(object)

	// Optional: set a generation-match precondition to avoid potential race
	// conditions and data corruptions. The request to upload is aborted if the
	// object's generation number does not match your precondition.
	// For an object that does not yet exist, set the DoesNotExist precondition.
	o = o.If(storage.Conditions{DoesNotExist: true})
	// If the live object already exists in your bucket, set instead a
	// generation-match precondition using the live object's generation number.
	// attrs, err := o.Attrs(ctx)
	// if err != nil {
	//      return fmt.Errorf("object.Attrs: %v", err)
	// }
	// o = o.If(storage.Conditions{GenerationMatch: attrs.Generation})

	// Upload an object with storage.Writer.
	wc := o.NewWriter(ctx)
	if _, err = io.Copy(wc, f); err != nil {
		return fmt.Errorf("io.Copy: %v", err.Error())
	}
	if err := wc.Close(); err != nil {
		return fmt.Errorf("Writer.Close: %v", err.Error())
	}
	fmt.Fprintf(w, "Blob %v uploaded.\n", object)
	return nil
}
