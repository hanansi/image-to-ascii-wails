package main

import (
	"bytes"
	"context"
	"encoding/base64"
	"image"
	"image/draw"
	"image/jpeg"
	"log"
	"net/http"
	"os"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) FetchImageAsBytes() []byte {
	path, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Select an image",
		Filters: []runtime.FileFilter{
			{
				DisplayName: "Images (*.png;*.jpg)",
				Pattern:     "*.png;*.jpg",
			},
		},
	})
	if err != nil {
		log.Fatal(err)
	}

	bytes, err := os.ReadFile(path)
	if err != nil {
		log.Fatal(err)
	}

	return bytes
}

func (a *App) EncodeImageToBase64(imageBytes []byte) string {
	var base64Encoding string

	mimeType := http.DetectContentType(imageBytes)

	switch mimeType {
	case "image/jpeg":
		base64Encoding += "data:image/jpeg;base64,"
	case "image/png":
		base64Encoding += "data:image/png;base64,"
	}

	// Append the base64 encoded output
	base64Encoding += base64.StdEncoding.EncodeToString(imageBytes)

	return base64Encoding
}

func (a *App) DecodeImage(imageBytes []byte) image.Image {
	byteReader := bytes.NewReader(imageBytes)

	// TODO - Make it decode jpeg and png (maybe other image formats in the future)
	img, err := jpeg.Decode(byteReader)
	if err != nil {
		log.Fatal(err)
	}

	return img
}

func (a *App) ConvertImageToGrayscale(imageBytes []byte) []byte {
	img := a.DecodeImage(imageBytes)

	var grayScaleImage bytes.Buffer

	result := image.NewGray(img.Bounds())
	draw.Draw(result, result.Bounds(), img, img.Bounds().Min, draw.Src)

	jpeg.Encode(&grayScaleImage, result, nil)

	return grayScaleImage.Bytes()
}
