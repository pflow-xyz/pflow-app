package cid

import (
	"testing"
)

func TestCidPrefix(t *testing.T) {
	out := ToCid([]byte("hello"))
	if out.String() != "zb2rhZfjRh2FHHB2RkHVEvL2vJnCTcu7kwRqgVsf9gpkLgteo" {
		t.Fatalf("mismatch %v", out.String())
	}
}

func TestNewCid(t *testing.T) {
	out := NewCid([]byte("hello"))
	if out.String() != "zb2rhZfjRh2FHHB2RkHVEvL2vJnCTcu7kwRqgVsf9gpkLgteo" {
		t.Fatalf("mismatch %v", out.String())
	}
}

func TestMarshal(t *testing.T) {
	out := Marshal([]byte("hello"))
	if string(out) != "\"aGVsbG8=\"" {
		t.Fatalf("mismatch %v", string(out))
	}
	var out2 []byte
	err := Unmarshal(out, &out2)
	if err != nil {
		t.Fatalf("error %v", err)
	}
	if string(out2) != "hello" {
		t.Fatalf("mismatch %v", string(out2))
	}
}
